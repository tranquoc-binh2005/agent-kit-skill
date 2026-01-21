#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import { generateDockerfile, generateDockerCompose, getScaffold } from './docker.js';
import { downloadCodebase as runDownload } from './downloader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

// i18n messages
const messages = {
    en: {
        welcome: 'Agent Kit Setup Wizard',
        ideQuestion: 'Which IDE are you using?',
        languageQuestion: 'Preferred language for prompts and responses:',
        projectTypeQuestion: 'What type of project is this?',
        techStackQuestion: 'Select your primary Tech Stack:',
        databaseQuestion: 'Select your Database:',
        rolesQuestion: 'Include specialized Roles (Architect, Reviewer, Debugger)?',
        envQuestion: 'Use Environment (Docker or Local)?',
        downloadQuestion: 'Download starter codebase template?',
        settingUp: 'Setting up your Agent Kit...',
        success: 'Setup complete! Agent Kit is ready.',
        nextSteps: 'Next Steps:',
        dockerSetup: 'Docker environment setup: Dockerfile, docker-compose.yml created.',
        failed: 'Setup failed!',
        configCreated: 'Config file created: agent-kit-skill.json',
    },
    vi: {
        welcome: 'Trinh Cai Dat Agent Kit',
        ideQuestion: 'Ban dang su dung IDE nao?',
        languageQuestion: 'Ngon ngu cho prompt va phan hoi:',
        projectTypeQuestion: 'Loai du an cua ban la gi?',
        techStackQuestion: 'Chon Tech Stack chinh:',
        databaseQuestion: 'Chon Database:',
        rolesQuestion: 'Bao gom cac Vai tro chuyen biet (Architect, Reviewer, Debugger)?',
        envQuestion: 'Su dung moi truong nao (Docker hay Local)?',
        downloadQuestion: 'Tai template codebase mau?',
        settingUp: 'Dang cai dat Agent Kit...',
        success: 'Cai dat hoan tat! Agent Kit da san sang.',
        nextSteps: 'Buoc tiep theo:',
        dockerSetup: 'Cau hinh Docker: Dockerfile, docker-compose.yml da duoc tao.',
        failed: 'Cai dat that bai!',
        configCreated: 'File config da tao: agent-kit-skill.json',
    }
};

program
    .name('agent-kit')
    .description('CLI to setup AI Agent Rules & Skills for Cursor, Windsurf, and Antigravity')
    .version('1.0.1');

program
    .command('init', { isDefault: true })
    .description('Initialize Agent Kit in the current directory')
    .action(() => runInit());

async function runInit() {
    console.log(chalk.bold.blue('\nAgent Kit Setup Wizard\n'));

    // Step 1: Ask for language first
    const langAnswer = await inquirer.prompt([
        {
            type: 'list',
            name: 'language',
            message: 'Select language / Chon ngon ngu:',
            choices: [
                { name: 'English', value: 'en' },
                { name: 'Tieng Viet', value: 'vi' },
            ],
        },
    ]);

    const lang = langAnswer.language;
    const msg = messages[lang];

    // Step 2: Ask remaining questions in selected language
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'ide',
            message: msg.ideQuestion,
            choices: [
                { name: 'Cursor (Recommended)', value: 'cursor' },
                { name: 'Windsurf (Codeium)', value: 'windsurf' },
                { name: 'Antigravity (Google)', value: 'antigravity' },
            ],
        },
        {
            type: 'list',
            name: 'type',
            message: msg.projectTypeQuestion,
            choices: [
                { name: lang === 'vi' ? 'Backend API' : 'Backend API', value: 'backend' },
                { name: lang === 'vi' ? 'Frontend Web' : 'Frontend Web', value: 'frontend' },
                { name: lang === 'vi' ? 'DevOps / Ha tang' : 'DevOps / Infrastructure', value: 'devops' },
                { name: lang === 'vi' ? 'Fullstack' : 'Fullstack', value: 'fullstack' },
                { name: lang === 'vi' ? 'Mobile App' : 'Mobile App', value: 'mobile' },
            ],
        },
        // Backend stack options
        {
            type: 'list',
            name: 'stack',
            message: msg.techStackQuestion,
            when: (answers) => answers.type === 'backend',
            choices: [
                { name: 'NestJS (Node.js TypeScript)', value: 'nestjs' },
                { name: 'Laravel (PHP)', value: 'laravel' },
                { name: 'Go (Golang)', value: 'go' },
                { name: 'Python (FastAPI)', value: 'python' },
                { name: 'Node.js (Express)', value: 'express' },
            ],
        },
        // Frontend stack options
        {
            type: 'list',
            name: 'stack',
            message: msg.techStackQuestion,
            when: (answers) => answers.type === 'frontend',
            choices: [
                { name: 'Next.js (React)', value: 'nextjs' },
                { name: 'Vue 3 / Nuxt 3', value: 'vue' },
                { name: 'Angular (v17+)', value: 'angular' },
                { name: 'React (Vite)', value: 'react' },
            ],
        },
        // Fullstack: Select Frontend Stack
        {
            type: 'list',
            name: 'frontendStack',
            message: lang === 'vi' ? 'Chon Frontend Tech Stack:' : 'Select Frontend Tech Stack:',
            when: (answers) => answers.type === 'fullstack',
            choices: [
                { name: 'Next.js (React)', value: 'nextjs' },
                { name: 'Vue 3 / Nuxt 3', value: 'vue' },
                { name: 'Angular (v17+)', value: 'angular' },
                { name: 'React (Vite)', value: 'react' },
            ],
        },
        // Fullstack: Select Backend Stack
        {
            type: 'list',
            name: 'backendStack',
            message: lang === 'vi' ? 'Chon Backend Tech Stack:' : 'Select Backend Tech Stack:',
            when: (answers) => answers.type === 'fullstack',
            choices: [
                { name: 'NestJS (Node.js TypeScript)', value: 'nestjs' },
                { name: 'Laravel (PHP)', value: 'laravel' },
                { name: 'Go (Golang)', value: 'go' },
                { name: 'Python (FastAPI)', value: 'python' },
                { name: 'Node.js (Express)', value: 'express' },
            ],
        },
        // Mobile stack options
        {
            type: 'list',
            name: 'stack',
            message: msg.techStackQuestion,
            when: (answers) => answers.type === 'mobile',
            choices: [
                { name: 'Flutter (Dart)', value: 'flutter' },
                { name: 'React Native', value: 'react-native' },
                { name: 'SwiftUI (iOS)', value: 'swiftui' },
                { name: 'Kotlin (Android)', value: 'android' },
            ],
        },
        // Database selection
        {
            type: 'list',
            name: 'database',
            message: msg.databaseQuestion,
            when: (answers) => ['backend', 'fullstack'].includes(answers.type),
            choices: [
                { name: 'PostgreSQL', value: 'postgresql' },
                { name: 'MySQL', value: 'mysql' },
                { name: 'MongoDB', value: 'mongodb' },
                { name: 'SQLite', value: 'sqlite' },
                { name: lang === 'vi' ? 'Khac / Khong co' : 'Other / None', value: 'none' },
            ],
        },
        // Role selection
        {
            type: 'checkbox',
            name: 'roles',
            message: msg.rolesQuestion,
            choices: [
                { name: 'Implementer (Default)', value: 'implementer', checked: true },
                { name: 'Architect (System Design)', value: 'architect', checked: true },
                { name: 'Reviewer (Code Review)', value: 'reviewer', checked: true },
                { name: 'Debugger (Bug Fixing)', value: 'debugger', checked: true },
            ],
        },
        // NEW: Language Variant selection (JS/TS) for relevant stacks
        {
            type: 'list',
            name: 'languageVariant',
            message: lang === 'vi' ? 'Chon ngon ngu code (Javascript / Typescript):' : 'Select code language (Javascript / Typescript):',
            when: (answers) => {
                const variants = ['nestjs', 'nextjs', 'react', 'vue', 'react-native', 'express']; // Angular is TS only
                if (answers.type === 'fullstack') {
                    return variants.includes(answers.frontendStack) || variants.includes(answers.backendStack);
                }
                return variants.includes(answers.stack);
            },
            choices: [
                { name: 'TypeScript (Recommended)', value: 'ts' },
                { name: 'JavaScript', value: 'js' },
            ],
            default: 'ts'
        },
        // Environment selection
        {
            type: 'list',
            name: 'environment',
            message: msg.envQuestion,
            choices: [
                { name: lang === 'vi' ? 'Docker Environment (Tuy chon)' : 'Docker Environment (Preferred)', value: 'docker' },
                { name: lang === 'vi' ? 'Local Host (Tu cau hinh)' : 'Local Host (Self-configured)', value: 'local' },
            ],
        },
        // Codebase download option
        {
            type: 'confirm',
            name: 'downloadCodebase',
            message: msg.downloadQuestion,
            default: false,
        },
    ]);

    // Merge language into answers
    answers.language = lang;

    // Standardize 'stack' for fullstack
    if (answers.type === 'fullstack') {
        answers.stack = [answers.frontendStack, answers.backendStack];
    }

    const spinner = ora(msg.settingUp).start();

    try {
        const kitRoot = path.join(__dirname, '../templates');
        const currentDir = process.cwd();

        // 0. Download Codebase (works for both Docker and Local environments)
        if (answers.downloadCodebase) {
            spinner.stop();

            // Handle multiple downloads for Fullstack
            if (Array.isArray(answers.stack)) {
                console.log(chalk.cyan(`\n> Downloading Fullstack Codebase...`));

                const projectName = path.basename(currentDir);

                // 1. Frontend
                console.log(chalk.dim(`  - Frontend: ${answers.frontendStack}`));
                await fs.ensureDir(path.join(currentDir, 'frontend'));
                const feDownloaded = await runDownload(
                    answers.frontendStack,
                    path.join(currentDir, 'frontend'),
                    answers.languageVariant,
                    answers.database,
                    `${projectName}_frontend`
                );

                // 2. Backend
                console.log(chalk.dim(`  - Backend: ${answers.backendStack}`));
                await fs.ensureDir(path.join(currentDir, 'backend'));
                const beDownloaded = await runDownload(
                    answers.backendStack,
                    path.join(currentDir, 'backend'),
                    answers.languageVariant,
                    answers.database,
                    `${projectName}_backend`
                );

                if (feDownloaded && beDownloaded) {
                    console.log(chalk.green(`\n> Fullstack setup complete (frontend/ & backend/).`));
                } else {
                    console.log(chalk.yellow(`\n! Partial or failed download for fullstack.`));
                }

            } else {
                // Single stack download
                const projectName = path.basename(currentDir);
                const downloaded = await runDownload(
                    answers.stack,
                    currentDir,
                    answers.languageVariant,
                    answers.database,
                    projectName
                );
                if (downloaded) {
                    console.log(chalk.green(`\n> Codebase setup complete.`));
                } else {
                    console.log(chalk.yellow(`\n! Codebase download skipped or not supported for ${answers.stack}.`));
                }
            }
            spinner.start();
        }

        // Setup based on IDE
        if (answers.ide === 'cursor') {
            await setupCursor(kitRoot, currentDir, answers);
        } else if (answers.ide === 'windsurf') {
            await setupWindsurf(kitRoot, currentDir, answers);
        } else if (answers.ide === 'antigravity') {
            await setupAntigravity(kitRoot, currentDir, answers);
        }

        // Setup Docker if requested (after codebase download)
        if (answers.environment === 'docker' && answers.stack) {
            const projectName = path.basename(currentDir);

            // 1. Generate Dockerfile
            const dockerfileContent = generateDockerfile(answers.stack);
            await fs.outputFile(path.join(currentDir, 'Dockerfile'), dockerfileContent);

            // 2. Generate Docker Compose
            const composeContent = generateDockerCompose(projectName, answers.stack, answers.database);
            await fs.outputFile(path.join(currentDir, 'docker-compose.yml'), composeContent);

            console.log(chalk.cyan(`\n> ${msg.dockerSetup}`));

            // 3. Only scaffold if codebase was NOT downloaded
            if (!answers.downloadCodebase) {
                const scaffoldFiles = getScaffold(answers.stack);
                for (const [filePath, content] of Object.entries(scaffoldFiles)) {
                    const targetPath = path.join(currentDir, filePath);
                    if (!await fs.pathExists(targetPath)) {
                        await fs.outputFile(targetPath, content);
                    }
                }
                if (Object.keys(scaffoldFiles).length > 0) {
                    console.log(chalk.dim('  - Scaffolding basic app structure...'));
                }
            }
        }

        // Generate JSON config file
        await generateJsonConfig(currentDir, answers);

        // Generate AI context file based on language
        await generateContextFile(currentDir, answers);

        spinner.succeed(chalk.green(msg.success));
        console.log(chalk.cyan(`\n> ${msg.configCreated}`));
        console.log(chalk.yellow(`\n${msg.nextSteps}`));

        if (answers.ide === 'cursor') {
            console.log('1. Open .cursorrules to see active rules');
            console.log('2. Type / in Chat to use Skills');
            console.log('3. Edit agent-kit-skill.json to customize settings');
        } else if (answers.ide === 'windsurf') {
            console.log('1. Check AGENTS.md in root');
            console.log('2. Use @skill-name in Cascade');
            console.log('3. Edit agent-kit-skill.json to customize settings');
        } else if (answers.ide === 'antigravity') {
            console.log('1. Check .agent/rules/ for loaded rules');
            console.log('2. Use /skill-name to invoke skills');
            console.log('3. Edit agent-kit-skill.json to customize settings');
        }

        if (answers.downloadCodebase && answers.environment !== 'docker') {
            // Already handled download above.
        } else if (answers.downloadCodebase && answers.environment === 'docker') {
            // Handled by scaffold.
        }

    } catch (error) {
        spinner.fail(chalk.red(msg.failed));
        console.error(error);
    }
}

// Update command - reload config
program
    .command('update')
    .description('Update Agent Kit based on agent-kit-skill.json')
    .action(async () => {
        const currentDir = process.cwd();
        const configPath = path.join(currentDir, 'agent-kit-skill.json');

        if (!await fs.pathExists(configPath)) {
            console.log(chalk.red('❌ agent-kit-skill.json not found. Run "agent-kit init" first.'));
            return;
        }

        const spinner = ora('Reloading configuration...').start();

        try {
            const config = await fs.readJson(configPath);
            const kitRoot = path.join(__dirname, '../templates');

            // Re-setup based on stored config
            const answers = {
                ide: config.ide,
                type: config.projectType,
                stack: config.techStack,
                database: config.database,
                roles: config.roles,
                language: config.language,
                // assume docker managed separately
            };

            if (config.ide === 'cursor') {
                await setupCursor(kitRoot, currentDir, answers);
            } else if (config.ide === 'windsurf') {
                await setupWindsurf(kitRoot, currentDir, answers);
            } else if (config.ide === 'antigravity') {
                await setupAntigravity(kitRoot, currentDir, answers);
            }

            // Update timestamp
            config.updatedAt = new Date().toISOString();
            await fs.writeJson(configPath, config, { spaces: 2 });

            spinner.succeed(chalk.green('Configuration reloaded successfully!'));
        } catch (error) {
            spinner.fail(chalk.red('Update failed!'));
            console.error(error);
        }
    });

async function setupCursor(kitRoot, dest, answers) {
    const cursorDir = path.join(dest, '.cursor');
    await fs.ensureDir(cursorDir);

    console.log(chalk.dim('  - Setting up .cursor...'));

    // 1. Copy .cursorrules (Entry point)
    const rulesSrc = path.join(kitRoot, 'cursorrules.template');
    if (await fs.pathExists(rulesSrc)) {
        await fs.copy(rulesSrc, path.join(dest, '.cursorrules'));
    }

    // Copy Resources (Knowledge, Rules)
    const knowledgeSrc = path.join(kitRoot, 'knowledge');
    if (await fs.pathExists(knowledgeSrc)) {
        await fs.copy(knowledgeSrc, path.join(cursorDir, 'knowledge'));
    }
    const rulesDirSrc = path.join(kitRoot, 'rules');
    if (await fs.pathExists(rulesDirSrc)) {
        await fs.copy(rulesDirSrc, path.join(cursorDir, 'rules'));
    }

    const skillsSrc = path.join(kitRoot, 'skills');
    const skillsDest = path.join(cursorDir, 'skills');
    await fs.ensureDir(skillsDest);

    // Always copy Project Standards
    const projectStandardsSrc = path.join(skillsSrc, 'project-standards');
    if (await fs.pathExists(projectStandardsSrc)) {
        await fs.copy(projectStandardsSrc, path.join(skillsDest, 'project-standards'));
    }

    // Copy selected roles
    if (answers.roles && answers.roles.length > 0) {
        for (const role of answers.roles) {
            const roleSrc = path.join(skillsSrc, `role-${role}`);
            if (await fs.pathExists(roleSrc)) {
                await fs.copy(roleSrc, path.join(skillsDest, `role-${role}`));
            }
        }
    }


    // 4. Copy Tech Stack
    if (answers.stack) {
        const stackMapping = {
            'nestjs': 'backend-nestjs',
            'laravel': 'backend-laravel',
            'go': 'backend-go',
            'python': 'backend-python',
            'express': 'backend-express',
            'nextjs': 'frontend-nextjs',
            'vue': 'frontend-vue',
            'angular': 'frontend-angular',
            'react': 'frontend-react',
            'flutter': 'mobile-flutter',
            'react-native': 'mobile-react-native',
            'swiftui': 'mobile-swiftui',
            'android': 'mobile-android',
            // Composite keys removed, logic now handles arrays
        };

        const stacksToCopy = Array.isArray(answers.stack) ? answers.stack : [answers.stack];

        for (const stack of stacksToCopy) {
            const skillName = stackMapping[stack];
            if (skillName) {
                const src = path.join(skillsSrc, skillName);
                if (await fs.pathExists(src)) {
                    await fs.copy(src, path.join(skillsDest, skillName));
                }
            }
        }
    }

    // Copy DevOps skills for backend/fullstack
    if (['backend', 'fullstack', 'devops'].includes(answers.type)) {
        const dockerSrc = path.join(skillsSrc, 'devops-docker');
        if (await fs.pathExists(dockerSrc)) {
            await fs.copy(dockerSrc, path.join(skillsDest, 'devops-docker'));
        }
        const cicdSrc = path.join(skillsSrc, 'devops-cicd');
        if (await fs.pathExists(cicdSrc)) {
            await fs.copy(cicdSrc, path.join(skillsDest, 'devops-cicd'));
        }
    }

    // Copy Workflows
    const workflowsSrc = path.join(kitRoot, 'workflows');
    if (await fs.pathExists(workflowsSrc)) {
        await fs.copy(workflowsSrc, path.join(cursorDir, 'workflows'));
    }
}

async function setupWindsurf(kitRoot, dest, answers) {
    const windsurfDir = path.join(dest, '.windsurf');
    await fs.ensureDir(windsurfDir);
    await fs.ensureDir(path.join(windsurfDir, 'rules'));

    console.log(chalk.dim('  - Setting up .windsurf...'));

    // 1. Copy AGENTS.md (Entry point)
    const agentsSrc = path.join(kitRoot, 'agents.md.template');
    if (await fs.pathExists(agentsSrc)) {
        await fs.copy(agentsSrc, path.join(dest, 'AGENTS.md'));
    }

    // Copy Resources (Knowledge, Rules, Workflows)
    const knowledgeSrc = path.join(kitRoot, 'knowledge');
    if (await fs.pathExists(knowledgeSrc)) {
        await fs.copy(knowledgeSrc, path.join(windsurfDir, 'knowledge'));
    }
    const rulesDirSrc = path.join(kitRoot, 'rules');
    if (await fs.pathExists(rulesDirSrc)) {
        await fs.copy(rulesDirSrc, path.join(windsurfDir, 'rules'));
    }
    const workflowsSrc = path.join(kitRoot, 'workflows');
    if (await fs.pathExists(workflowsSrc)) {
        await fs.copy(workflowsSrc, path.join(windsurfDir, 'workflows'));
    }

    const skillsSrc = path.join(kitRoot, 'skills');
    const skillsDest = path.join(windsurfDir, 'skills');
    await fs.ensureDir(skillsDest);

    // Copy Project Standards
    const projectStandardsSrc = path.join(skillsSrc, 'project-standards');
    if (await fs.pathExists(projectStandardsSrc)) {
        await fs.copy(projectStandardsSrc, path.join(skillsDest, 'project-standards'));
    }

    // Copy selected roles
    if (answers.roles && answers.roles.length > 0) {
        for (const role of answers.roles) {
            const roleSrc = path.join(skillsSrc, `role-${role}`);
            if (await fs.pathExists(roleSrc)) {
                await fs.copy(roleSrc, path.join(skillsDest, `role-${role}`));
            }
        }
    }

    // Copy Stack Skills
    if (answers.stack) {
        const stackMapping = {
            'nestjs': 'backend-nestjs',
            'laravel': 'backend-laravel',
            'go': 'backend-go',
            'python': 'backend-python',
            'express': 'backend-express',
            'nextjs': 'frontend-nextjs',
            'vue': 'frontend-vue',
            'angular': 'frontend-angular',
            'react': 'frontend-react',
            'flutter': 'mobile-flutter',
            'react-native': 'mobile-react-native',
            'swiftui': 'mobile-swiftui',
            'android': 'mobile-android',
        };

        const stacksToCopy = Array.isArray(answers.stack) ? answers.stack : [answers.stack];

        for (const stack of stacksToCopy) {
            const skillName = stackMapping[stack];
            if (skillName) {
                await copySkill(skillsSrc, skillsDest, skillName);
            }
        }
    }

    // 5. Copy DevOps (Optional)
    if (['backend', 'fullstack', 'devops'].includes(answers.type)) {
        await copySkill(skillsSrc, skillsDest, 'devops-docker');
        await copySkill(skillsSrc, skillsDest, 'devops-cicd');
    }
}

// Helper to copy safely
async function copySkill(srcRoot, destRoot, skillName) {
    const src = path.join(srcRoot, skillName);
    const dest = path.join(destRoot, skillName);
    if (await fs.pathExists(src)) {
        await fs.copy(src, dest);
    }
}

async function setupAntigravity(kitRoot, dest, answers) {
    const agentDir = path.join(dest, '.agent');
    await fs.ensureDir(agentDir);
    await fs.ensureDir(path.join(agentDir, 'rules'));
    await fs.ensureDir(path.join(agentDir, 'skills'));
    await fs.ensureDir(path.join(agentDir, 'workflows'));

    // Copy from templates/.agent if exists
    const templateAgentDir = path.join(kitRoot, '.agent');
    if (await fs.pathExists(templateAgentDir)) {
        await fs.copy(templateAgentDir, agentDir, { overwrite: false });
    }

    // Explicitly Copy Resources (Rules, Workflows, Knowledge) from templates root
    // This fixes the issue where structure is missing if not inside .agent template
    const knowledgeSrc = path.join(kitRoot, 'knowledge');
    if (await fs.pathExists(knowledgeSrc)) {
        await fs.copy(knowledgeSrc, path.join(agentDir, 'knowledge'));
    }
    const rulesDirSrc = path.join(kitRoot, 'rules');
    if (await fs.pathExists(rulesDirSrc)) {
        await fs.copy(rulesDirSrc, path.join(agentDir, 'rules'));
    }
    const workflowsSrc = path.join(kitRoot, 'workflows');
    if (await fs.pathExists(workflowsSrc)) {
        await fs.copy(workflowsSrc, path.join(agentDir, 'workflows'));
    }

    // Copy Skills
    const skillsSrc = path.join(kitRoot, 'skills');
    const skillsDest = path.join(agentDir, 'skills');

    // Copy Project Standards
    const projectStandardsSrc = path.join(skillsSrc, 'project-standards');
    if (await fs.pathExists(projectStandardsSrc)) {
        await fs.copy(projectStandardsSrc, path.join(skillsDest, 'project-standards'));
    }

    // Copy selected roles
    if (answers.roles && answers.roles.length > 0) {
        for (const role of answers.roles) {
            const roleSrc = path.join(skillsSrc, `role-${role}`);
            if (await fs.pathExists(roleSrc)) {
                await fs.copy(roleSrc, path.join(skillsDest, `role-${role}`));
            }
        }
    }

    // Copy Stack Skills
    if (answers.stack) {
        const stackMapping = {
            'nestjs': 'backend-nestjs',
            'laravel': 'backend-laravel',
            'go': 'backend-go',
            'python': 'backend-python',
            'express': 'backend-express',
            'nextjs': 'frontend-nextjs',
            'vue': 'frontend-vue',
            'angular': 'frontend-angular',
            'react': 'frontend-react',
            'flutter': 'mobile-flutter',
            'react-native': 'mobile-react-native',
            'swiftui': 'mobile-swiftui',
            'android': 'mobile-android',
        };

        const stacksToCopy = Array.isArray(answers.stack) ? answers.stack : [answers.stack];

        for (const stack of stacksToCopy) {
            const skillName = stackMapping[stack];
            if (skillName) {
                await copySkill(skillsSrc, skillsDest, skillName);
            }
        }
    }

    // Copy DevOps (Optional)
    if (['backend', 'fullstack', 'devops'].includes(answers.type)) {
        await copySkill(skillsSrc, skillsDest, 'devops-docker');
        await copySkill(skillsSrc, skillsDest, 'devops-cicd');
    }
}

async function generateJsonConfig(dest, answers) {
    const isVi = answers.language === 'vi';

    // Template prompts based on project type and language
    const templatePrompts = {
        _description: isVi
            ? "Danh sach cac prompt mau de su dung voi AI Agent. Copy va chinh sua theo nhu cau."
            : "List of template prompts to use with AI Agent. Copy and modify as needed.",

        general: isVi ? [
            "Hay doc file agent-kit-skill.json va hieu context du an truoc khi tra loi",
            "Tao mot [ten feature] voi day du validation va error handling",
            "Giai thich code trong file [ten file] va de xuat cai tien"
        ] : [
            "Read agent-kit-skill.json and understand project context before responding",
            "Create a [feature name] with full validation and error handling",
            "Explain code in [filename] and suggest improvements"
        ],

        backend: isVi ? [
            "/backend Tao CRUD API cho entity [ten entity] voi DTO validation",
            "/backend Thiet ke database schema cho tinh nang [ten feature]",
            "/backend Toi uu hoa query N+1 trong [ten file]",
            "/backend Tao authentication middleware voi JWT"
        ] : [
            "/backend Create CRUD API for [entity name] with DTO validation",
            "/backend Design database schema for [feature name]",
            "/backend Optimize N+1 query in [filename]",
            "/backend Create authentication middleware with JWT"
        ],

        frontend: isVi ? [
            "/frontend Tao component [ten component] voi responsive design",
            "/frontend Toi uu hoa performance cho trang [ten page]",
            "/frontend Them loading state va error handling cho [component]",
            "/frontend Refactor state management su dung React Query"
        ] : [
            "/frontend Create [component name] with responsive design",
            "/frontend Optimize performance for [page name]",
            "/frontend Add loading state and error handling for [component]",
            "/frontend Refactor state management using React Query"
        ],

        debug: isVi ? [
            "/debug Phan tich loi: [paste error message]",
            "/debug Tim nguyen nhan loi 'Cannot read property of undefined'",
            "/debug Fix memory leak trong component [ten component]",
            "/debug Debug API return 500 Internal Server Error"
        ] : [
            "/debug Analyze error: [paste error message]",
            "/debug Find root cause of 'Cannot read property of undefined'",
            "/debug Fix memory leak in component [component name]",
            "/debug Debug API returning 500 Internal Server Error"
        ],

        reviewer: isVi ? [
            "/reviewer Review code trong PR nay: [paste code hoac file path]",
            "/reviewer Kiem tra security issues trong [ten file]",
            "/reviewer Danh gia code quality va de xuat cai tien",
            "/reviewer Review database migration truoc khi deploy"
        ] : [
            "/reviewer Review code in this PR: [paste code or file path]",
            "/reviewer Check security issues in [filename]",
            "/reviewer Evaluate code quality and suggest improvements",
            "/reviewer Review database migration before deploy"
        ],

        architect: isVi ? [
            "/architect Thiet ke system architecture cho tinh nang [feature]",
            "/architect Phan tich trade-offs giua [option A] va [option B]",
            "/architect Tao ADR cho quyet dinh su dung [technology]",
            "/architect Thiet ke microservices cho he thong [ten system]"
        ] : [
            "/architect Design system architecture for [feature]",
            "/architect Analyze trade-offs between [option A] and [option B]",
            "/architect Create ADR for decision to use [technology]",
            "/architect Design microservices for [system name]"
        ],

        devops: isVi ? [
            "/devops Tao Dockerfile cho ung dung [tech stack]",
            "/devops Thiet ke CI/CD pipeline voi GitHub Actions",
            "/devops Cau hinh Kubernetes deployment",
            "/devops Toi uu Docker image size"
        ] : [
            "/devops Create Dockerfile for [tech stack] application",
            "/devops Design CI/CD pipeline with GitHub Actions",
            "/devops Configure Kubernetes deployment",
            "/devops Optimize Docker image size"
        ]
    };

    const config = {
        version: '1.0.0',
        ide: answers.ide,
        language: answers.language,
        projectType: answers.type,
        techStack: answers.stack || null,
        languageVariant: answers.languageVariant || null,
        database: answers.database || null,
        roles: answers.roles || ['implementer'],
        focusModes: {
            enabled: true,
            default: answers.type,
            available: ['backend', 'frontend', 'devops', 'fullstack', 'mobile', 'debug', 'reviewer', 'architect']
        },
        templatePrompts: templatePrompts,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await fs.writeJson(path.join(dest, 'agent-kit-skill.json'), config, { spaces: 2 });
}

async function generateContextFile(dest, answers) {
    const lang = answers.language;

    const contextContent = lang === 'vi' ? `# Ngữ Cảnh Dự Án

## Thông Tin Cơ Bản
- **IDE:** ${answers.ide}
- **Loại Dự Án:** ${answers.type}
- **Tech Stack:** ${answers.stack || 'N/A'}
- **Ngôn Ngữ Code:** ${answers.languageVariant ? (answers.languageVariant === 'ts' ? 'TypeScript' : 'JavaScript') : 'N/A'}
- **Database:** ${answers.database || 'N/A'}
- **Ngôn Ngữ Giao Tiếp:** Tiếng Việt

## Hướng Dẫn Cho AI Agent

Khi trả lời, hãy:
1. Sử dụng tiếng Việt cho tất cả phản hồi
2. Tuân theo các quy tắc đã học trong thư mục skills/rules
3. Áp dụng Clean Code và SOLID principles
4. Đọc file agent-kit-skill.json để hiểu context dự án

## Focus Modes (Chế Độ Tập Trung)

Sử dụng các lệnh sau để chuyển chế độ:
- \`/backend\` - Tập trung vào API và database
- \`/frontend\` - Tập trung vào UI/UX
- \`/devops\` - Tập trung vào infrastructure
- \`/debug\` - Tập trung vào sửa lỗi
- \`/reviewer\` - Tập trung vào review code
- \`/architect\` - Tập trung vào thiết kế hệ thống
` : `# Project Context

## Basic Information
- **IDE:** ${answers.ide}
- **Project Type:** ${answers.type}
- **Tech Stack:** ${answers.stack || 'N/A'}
- **Code Language:** ${answers.languageVariant ? (answers.languageVariant === 'ts' ? 'TypeScript' : 'JavaScript') : 'N/A'}
- **Database:** ${answers.database || 'N/A'}
- **Language:** English

## Instructions for AI Agent

When responding:
1. Use English for all responses
2. Follow rules learned from skills/rules folders
3. Apply Clean Code and SOLID principles
4. Read agent-kit-skill.json to understand project context

## Focus Modes

Use these commands to switch modes:
- \`/backend\` - Focus on API and database
- \`/frontend\` - Focus on UI/UX
- \`/devops\` - Focus on infrastructure
- \`/debug\` - Focus on bug fixing
- \`/reviewer\` - Focus on code review
- \`/architect\` - Focus on system design
`;

    // Save context file based on IDE
    let contextPath;
    if (answers.ide === 'cursor') {
        contextPath = path.join(dest, 'cursor-project-config.md');
    } else if (answers.ide === 'windsurf') {
        contextPath = path.join(dest, '.windsurf', 'project-config.md');
    } else {
        contextPath = path.join(dest, '.agent', 'PROJECT_CONTEXT.md');
    }

    await fs.outputFile(contextPath, contextContent);
}

program.parse(process.argv);
