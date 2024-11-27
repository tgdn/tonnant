# Tonnant Monorepo

This monorepo is managed using [Turbo](https://turbo.build/repo/docs) and its core functionalities.

## Prerequisites

🟠 Ensure you're using the correct version of pnpm. Your pnpm version should be <b>9.6.0</b>. You can check your version with `pnpm -v`.

You can install pnpm with your package manager of choice:

- e.g `corepack enable && corepack prepare pnpm@9.6.0 --activate`.

## Getting Started

These commands should be run at the root of the project:

1. nvm use: Sets the version of node specified in .nvmrc
2. pnpm i: Installs node dependencies in all packages;
3. pnpm dev -F @tonnant/backend: Starts backend development server

## Toolchain Overview

The following table provides an overview of the core tools and configurations used in this monorepo. These tools are essential for maintaining code quality, consistency, and efficiency across projects. Each tool has been carefully selected to support our workflow, and configurations are documented to help contributors get started quickly and understand our setup.

| Tool | Purpose | Configuration Location |
| ---- | ------- | ---------------------- |

| [**pnpm**](https://pnpm.io/) | Manages dependencies across packages in the monorepo, optimizing install times and space usage. | `package.json` > `engines` and `pnpm-lock.yaml` |
| [**Turbo**](https://turbo.build/repo/docs) | Orchestrates the monorepo workflow, managing dependencies, and building projects with a focus on performance. | `turbo.json` |
| [**ESLint**](https://eslint.org/) | Ensures code quality and style across projects, enforcing linting rules. \*\*\*\* | `eslint.config.mjs` |
| [**Prettier**](https://prettier.io/) | Formats code consistently across the project, integrated with ESLint. | `prettier.config.mjs` |
| [**TypeScript**](https://www.typescriptlang.org/) | Provides static type checking for JavaScript to enhance reliability and maintainability. | `tsconfig.json` and in each package’s config |
| [**nvm / fnm**](https://github.com/Schniz/fnm) | Manages Node.js versions, ensuring the correct Node version is used across environments. | `.nvmrc` |
