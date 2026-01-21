
const dockerTemplates = {
    nestjs: `
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
`,
    laravel: `
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \\
    git \\
    curl \\
    libpng-dev \\
    libonig-dev \\
    libxml2-dev \\
    zip \\
    unzip

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
`,
    go: `
FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

CMD ["./main"]
`,
    nextjs: `
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
`,
    vue: `
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
`,
    python: `
FROM python:3.9

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
`
};

const portMapping = {
    nestjs: "3000",
    laravel: "8000",
    go: "8080",
    nextjs: "3000",
    vue: "5173",
    python: "8000",
    express: "3000",
    react: "5173"
};

function generateDockerfile(stack) {
    return dockerTemplates[stack] || dockerTemplates.nestjs; // Fallback
}

function generateDockerCompose(projectName, stack, database) {
    let dbService = "";
    let dbEnv = "";
    let dbDepends = "";

    if (database === 'postgresql') {
        dbService = `
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ${projectName}
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data`;
        dbEnv = `
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=user
      - DB_PASSWORD=password
      - DB_NAME=${projectName}`;
        dbDepends = `
    depends_on:
      - postgres`;
    } else if (database === 'mysql') {
        dbService = `
  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: ${projectName}
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - '3306:3306'
    volumes:
      - mysql_data:/var/lib/mysql`;
        dbEnv = `
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=user
      - DB_PASSWORD=password
      - DB_DATABASE=${projectName}`;
        dbDepends = `
    depends_on:
      - mysql`;
    } else if (database === 'mongodb') {
        dbService = `
  mongo:
    image: mongo:latest
    restart: always
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db`;
        dbEnv = `
      - MONGO_URI=mongodb://mongo:27017/${projectName}`;
        dbDepends = `
    depends_on:
      - mongo`;
    }

    const appPort = portMapping[stack] || "3000";

    return `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${projectName}-app
    restart: unless-stopped
    ports:
      - '${appPort}:${appPort}'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development${dbEnv}
      - PORT=${appPort}
      ${dbDepends}${dbService}

volumes:
  ${database === 'postgresql' ? 'postgres_data:' : ''}
  ${database === 'mysql' ? 'mysql_data:' : ''}
  ${database === 'mongodb' ? 'mongo_data:' : ''}
`;
}

// Minimal Scaffold Files
const scaffolds = {
    nestjs: {
        'package.json': `{\n  "name": "agent-kit-app",\n  "scripts": {\n    "start:dev": "nest start --watch",\n    "start": "node dist/main"\n  },\n  "dependencies": {\n    "@nestjs/common": "^10.0.0",\n    "@nestjs/core": "^10.0.0",\n    "@nestjs/platform-express": "^10.0.0",\n    "reflect-metadata": "^0.1.13",\n    "rxjs": "^7.8.1"\n  }\n}`,
        'src/main.ts': `console.log("Agent Kit NestJS App Running");`
    },
    nextjs: {
        'package.json': `{\n  "name": "agent-kit-web",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start"\n  },\n  "dependencies": {\n    "next": "14.1.0",\n    "react": "^18",\n    "react-dom": "^18"\n  }\n}`,
        'app/page.tsx': `export default function Home() { return <h1>Hello Agent Kit Next.js - Dockerized!</h1> }`,
        'next.config.js': `module.exports = { output: 'standalone' }`
    },
    laravel: {
        'public/index.php': `<?php echo "Hello Agent Kit Laravel - Dockerized!"; ?>`,
        'composer.json': `{\n    "name": "agent-kit/laravel",\n    "type": "project",\n    "require": {\n        "php": "^8.1"\n    }\n}`
    },
    go: {
        'main.go': `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello Agent Kit Go - Dockerized!")\n}`,
        'go.mod': `module agent-kit-go\n\ngo 1.21`
    },
    python: {
        'main.py': `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"message": "Hello Agent Kit Python - Dockerized!"}`,
        'requirements.txt': `fastapi\nuvicorn`
    },
    vue: {
        'package.json': `{\n  "name": "agent-kit-vue",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "vue": "^3.4.0"\n  },\n  "devDependencies": {\n    "@vitejs/plugin-vue": "^5.0.0",\n    "vite": "^5.0.0"\n  }\n}`,
        'index.html': `<!DOCTYPE html><html><body><div id="app"></div><script type="module" src="/src/main.js"></script></body></html>`,
        'src/main.js': `import { createApp } from 'vue';\nimport App from './App.vue';\ncreateApp(App).mount('#app');`,
        'src/App.vue': `<template><h1>Hello Agent Kit Vue - Dockerized!</h1></template>`
    }
};

function getScaffold(stack) {
    return scaffolds[stack] || {};
}

module.exports = {
    generateDockerfile,
    generateDockerCompose,
    getScaffold
};
