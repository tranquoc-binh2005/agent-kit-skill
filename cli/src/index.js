#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

// i18n messages
const messages = {
    en: {
        welcome: '🚀 Agent Kit Setup Wizard',
        ideQuestion: 'Which IDE are you using?',
        languageQuestion: 'Preferred language for prompts and responses:',
        projectTypeQuestion: 'What type of project is this?',
        techStackQuestion: 'Select your primary Tech Stack:',
        databaseQuestion: 'Select your Database:',
        rolesQuestion: 'Include specialized Roles (Architect, Reviewer, Debugger)?',
        downloadQuestion: 'Download starter codebase template?',
        settingUp: 'Setting up your Agent Kit...',
        success: 'Setup complete! Agent Kit is ready.',
        nextSteps: 'Next Steps:',
        failed: 'Setup failed!',
        configCreated: 'Config file created: agent-kit-skill.json',
    },
    vi: {
        welcome: '🚀 Trình Cài Đặt Agent Kit',
        ideQuestion: 'Bạn đang sử dụng IDE nào?',
        languageQuestion: 'Ngôn ngữ cho prompt và phản hồi:',
        projectTypeQuestion: 'Loại dự án của bạn là gì?',
        techStackQuestion: 'Chọn Tech Stack chính:',
        databaseQuestion: 'Chọn Database:',
        rolesQuestion: 'Bao gồm các Vai trò chuyên biệt (Architect, Reviewer, Debugger)?',
        downloadQuestion: 'Tải template codebase mẫu?',
        settingUp: 'Đang cài đặt Agent Kit...',
        success: 'Cài đặt hoàn tất! Agent Kit đã sẵn sàng.',
        nextSteps: 'Bước tiếp theo:',
        failed: 'Cài đặt thất bại!',
        configCreated: 'File config đã tạo: agent-kit-skill.json',
    }
};

program
    .name('agent-kit')
    .description('CLI to setup AI Agent Rules & Skills for Cursor, Windsurf, and Antigravity')
    .version('1.0.0');

program
    .command('init')
    .description('Initialize Agent Kit in the current directory')
    .action(async () => {
        console.log(chalk.bold.blue('\n🚀 Agent Kit Setup Wizard\n'));

        // Step 1: Ask for language first
        const langAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'language',
                message: 'Select language / Chọn ngôn ngữ:',
                choices: [
                    { name: 'English', value: 'en' },
                    { name: 'Tiếng Việt', value: 'vi' },
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
                    { name: lang === 'vi' ? 'DevOps / Hạ tầng' : 'DevOps / Infrastructure', value: 'devops' },
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
                    { name: 'React (Vite)', value: 'react' },
                ],
            },
            // Fullstack stack options
            {
                type: 'list',
                name: 'stack',
                message: msg.techStackQuestion,
                when: (answers) => answers.type === 'fullstack',
                choices: [
                    { name: 'Next.js + NestJS', value: 'nextjs-nestjs' },
                    { name: 'Nuxt 3 + Laravel', value: 'nuxt-laravel' },
                    { name: 'React + Express', value: 'react-express' },
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
                    { name: lang === 'vi' ? 'Khác / Không có' : 'Other / None', value: 'none' },
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

        const spinner = ora(msg.settingUp).start();

        try {
            const kitRoot = path.join(__dirname, '../templates');
            const currentDir = process.cwd();

            // Setup based on IDE
            if (answers.ide === 'cursor') {
                await setupCursor(kitRoot, currentDir, answers);
            } else if (answers.ide === 'windsurf') {
                await setupWindsurf(kitRoot, currentDir, answers);
            } else if (answers.ide === 'antigravity') {
                await setupAntigravity(kitRoot, currentDir, answers);
            }

            // Generate JSON config file
            await generateJsonConfig(currentDir, answers);

            // Generate AI context file based on language
            await generateContextFile(currentDir, answers);

            spinner.succeed(chalk.green(msg.success));
            console.log(chalk.cyan(`\n📄 ${msg.configCreated}`));
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

            if (answers.downloadCodebase) {
                console.log(chalk.yellow('\n⚠️  Codebase download feature coming soon!'));
            }

        } catch (error) {
            spinner.fail(chalk.red(msg.failed));
            console.error(error);
        }
    });

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

    // Copy .cursorrules (template)
    const rulesSrc = path.join(kitRoot, 'cursorrules.template');
    if (await fs.pathExists(rulesSrc)) {
        await fs.copy(rulesSrc, path.join(dest, '.cursorrules'));
    }

    // Copy Skills
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

    // Copy Stack Specific Skills
    if (answers.stack) {
        const stackMapping = {
            'nestjs': 'backend-nestjs',
            'laravel': 'backend-laravel',
            'go': 'backend-go',
            'python': 'backend-python',
            'express': 'backend-express',
            'nextjs': 'frontend-nextjs',
            'vue': 'frontend-vue',
            'react': 'frontend-react',
            'flutter': 'mobile-flutter',
            'react-native': 'mobile-react-native',
            'swiftui': 'mobile-swiftui',
            'android': 'mobile-android',
            'nextjs-nestjs': ['frontend-nextjs', 'backend-nestjs'],
            'nuxt-laravel': ['frontend-vue', 'backend-laravel'],
            'react-express': ['frontend-react', 'backend-express'],
        };

        const skillNames = stackMapping[answers.stack];
        if (skillNames) {
            const skills = Array.isArray(skillNames) ? skillNames : [skillNames];
            for (const skillName of skills) {
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
}

async function setupWindsurf(kitRoot, dest, answers) {
    const windsurfDir = path.join(dest, '.windsurf');
    await fs.ensureDir(windsurfDir);
    await fs.ensureDir(path.join(windsurfDir, 'rules'));

    // Copy AGENTS.md (template)
    const agentsSrc = path.join(kitRoot, 'agents.md.template');
    if (await fs.pathExists(agentsSrc)) {
        await fs.copy(agentsSrc, path.join(dest, 'AGENTS.md'));
    }

    // Copy Skills to .windsurf/skills
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

    // Copy Stack Skills (same logic as Cursor)
    if (answers.stack) {
        const stackMapping = {
            'nestjs': 'backend-nestjs',
            'laravel': 'backend-laravel',
            'go': 'backend-go',
            'nextjs': 'frontend-nextjs',
            'vue': 'frontend-vue',
        };
        const skillName = stackMapping[answers.stack];
        if (skillName) {
            const src = path.join(skillsSrc, skillName);
            if (await fs.pathExists(src)) {
                await fs.copy(src, path.join(skillsDest, skillName));
            }
        }
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
- **Database:** ${answers.database || 'N/A'}
- **Ngôn Ngữ:** Tiếng Việt

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
