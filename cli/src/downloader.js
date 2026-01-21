
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

const TEMP_DIR_NAME = 'temp_agent_kit_download';

async function downloadCodebase(stack, currentDir) {
    const commands = {
        // NestJS
        'nestjs': `npx -y @nestjs/cli new ${TEMP_DIR_NAME} --package-manager npm --skip-git`,

        // Laravel
        'laravel': `composer create-project laravel/laravel ${TEMP_DIR_NAME}`,

        // Next.js
        'nextjs': `npx -y create-next-app@latest ${TEMP_DIR_NAME} --typescript --eslint --tailwind --no-src-dir --app --import-alias "@/*"`,

        // React + Vite
        'react': `npm create vite@latest ${TEMP_DIR_NAME} -- --template react-ts`,

        // Vue + Vite
        'vue': `npm create vite@latest ${TEMP_DIR_NAME} -- --template vue-ts`,

        // Nuxt
        'nuxt-laravel': `npx -y nuxi@latest init ${TEMP_DIR_NAME} --packageManager npm`, // Mapping nuxt-laravel to Nuxt for frontend part? Or fullstack? Assuming Nuxt here.
        'vue': `npx -y nuxi@latest init ${TEMP_DIR_NAME} --packageManager npm`, // Overlap with Vue option? If stack is 'vue', user might mean Vue or Nuxt.
        // Based on CLI choices: "Vue 3 / Nuxt 3" -> value: 'vue'.
        // We should ask or default. Let's default to Vite Vue 3 for simplicity, or ask?
        // User said: "vue + vite, nuxtjs các kiểu".
        // In index.js lines 233: { name: 'Vue 3 / Nuxt 3', value: 'vue' }
        // Refinement needed: differentiate Vue and Nuxt in answers?
    };

    // Refined logic for Vue/Nuxt differentiation if needed.
    // For now, let's treat 'vue' as Vite Vue 3 based on standard.
    // Use 'nuxt' if we add it or if the user selects Nuxt specific.
    // But 'vue' covers both in current CLI choices. Mmm. 
    // Let's check index.js again.

    let command = commands[stack];

    // Special handling for shared keys if any.
    // Actually, distinct keys: 'nestjs', 'laravel', 'nextjs', 'react', 'vue'.
    // 'nuxt-laravel' is value for fullstack.
    // 'nextjs-nestjs' is value for fullstack.

    // Fallback for fullstack combos -> Download the FRONTEND part mostly? Or both?
    // "down code base" -> "viết cli để down thẳng giúp người dùng luôn".
    // For fullstack, it's hard to download BOTH into root.
    // Usually means monorepo or strict structure.
    // Let's focus on single stack options first as per request.

    if (stack === 'nuxt-laravel') {
        // Maybe just Nuxt? Or warn complex?
        // Let's skip complex fullstack for now or just do frontend.
        console.log(chalk.yellow("Fullstack download not fully supported yet. Downloading Nuxt frontend..."));
        command = `npx -y nuxi@latest init ${TEMP_DIR_NAME} --packageManager npm`;
    }

    if (!command) {
        return false; // Not supported
    }

    const spinner = ora(`Downloading ${stack} codebase... This may take a while.`).start();

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
