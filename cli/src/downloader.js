
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { generateEnvFile } from './envGenerator.js';

const TEMP_DIR_NAME = 'temp_agent_kit_download';

async function downloadCodebase(stack, currentDir, languageVariant = 'ts', database = null, projectName = null) {
    const isTs = languageVariant === 'ts';

    let command = '';

    switch (stack) {
        case 'nestjs':
            // NestJS default is TS. JS mode requires flag --language js (or similar, but standard is TS).
            // Actually Nest CLI defaults to TS.
            // Documentation says: nest new project-name --language js (if supported in version).
            // But let's check recent Nest CLI. Yes, -l js or --language js.
            command = `npx -y @nestjs/cli new ${TEMP_DIR_NAME} --package-manager npm --skip-git ${isTs ? '' : '--language js'}`;
            break;

        case 'laravel':
            // PHP only, ignore JS/TS variant or treat as N/A
            command = `composer create-project laravel/laravel ${TEMP_DIR_NAME}`;
            break;

        case 'nextjs':
            // Next.js: --typescript or --javascript
            command = `npx -y create-next-app@latest ${TEMP_DIR_NAME} ${isTs ? '--typescript' : '--javascript'} --eslint --tailwind --no-src-dir --app --import-alias "@/*" --yes`;
            break;

        case 'react':
            // Vite React: template react-ts vs react
            command = `npm create vite@latest ${TEMP_DIR_NAME} -- --template ${isTs ? 'react-ts' : 'react'} -y`;
            break;

        case 'vue':
            // Vite Vue: template vue-ts vs vue
            command = `npm create vite@latest ${TEMP_DIR_NAME} -- --template ${isTs ? 'vue-ts' : 'vue'} -y`;
            break;

        case 'angular':
            // Angular CLI
            // --skip-install (fast)
            // --defaults (use default config)
            // --ssr=false (SPA mode)
            // --style=scss
            command = `npx -p @angular/cli@latest ng new ${TEMP_DIR_NAME} --skip-install --defaults --style=scss --ssr=false --package-manager npm`;
            break;

        case 'nuxt-laravel':
        case 'nuxt':
            // Nuxt 3: nuxi init doesn't strongly enforce JS/TS via flag in same way, 
            // but we can try to find if there is a preference.
            // nuxi init defaults to a TsConfig present. User writes script setup lang="ts".
            // We will just run standard init.
            command = `npx -y nuxi@latest init ${TEMP_DIR_NAME} --packageManager npm`;
            break;

        default:
            return false;
    }

    if (!command) {
        return false; // Not supported
    }

    const spinner = ora(`Downloading ${stack} codebase (${isTs ? 'TypeScript' : 'JavaScript'})... This may take a while.`).start();

    try {
        // 1. Run command to create in temp dir
        execSync(command, { stdio: 'inherit', cwd: currentDir });

        const tempPath = path.join(currentDir, TEMP_DIR_NAME);

        // 2. Move files from temp dir to current dir
        if (await fs.pathExists(tempPath)) {
            const files = await fs.readdir(tempPath);
            for (const file of files) {
                await fs.move(path.join(tempPath, file), path.join(currentDir, file), { overwrite: true });
            }
            // 3. Cleanup temp dir
            await fs.remove(tempPath);

            // 4. Verify node_modules exists for Node.js projects (NestJS, Next.js, React, Vue, Angular, Nuxt)
            const needsNodeModules = ['nestjs', 'nextjs', 'react', 'vue', 'angular', 'nuxt', 'nuxt-laravel'];
            if (needsNodeModules.includes(stack)) {
                const nodeModulesPath = path.join(currentDir, 'node_modules');
                if (!await fs.pathExists(nodeModulesPath)) {
                    spinner.text = 'Installing dependencies...';
                    execSync('npm install', { stdio: 'inherit', cwd: currentDir });
                }
            }

            // 5. Customize default messages for specific stacks
            if (stack === 'nestjs') {
                const appServicePath = path.join(currentDir, 'src/app.service.ts');
                if (await fs.pathExists(appServicePath)) {
                    const customMessage = `import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World, I\\'m Teodevlor, cảm ơn đã sử dụng và góp ý.';
  }
}
`;
                    await fs.writeFile(appServicePath, customMessage);
                }
            }

            // 6. Generate .env file with database configuration
            if (database && database !== 'none' && projectName) {
                spinner.text = 'Configuring environment variables...';
                await generateEnvFile(stack, database, projectName, currentDir);
            }

            spinner.succeed(chalk.green(`Codebase for ${stack} downloaded successfully!`));
            return true;
        } else {
            spinner.fail(chalk.red("Download failed: Temp directory not found."));
            return false;
        }

    } catch (error) {
        spinner.fail(chalk.red(`Failed to download codebase for ${stack}.`));
        console.error(error.message);
        // Try cleanup
        try { await fs.remove(path.join(currentDir, TEMP_DIR_NAME)); } catch (e) { }
        return false;
    }
}

export { downloadCodebase };
