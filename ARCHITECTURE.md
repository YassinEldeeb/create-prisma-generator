# Architecture

## create-prisma-generator
This package is the `main CLI` that prompt questions to developers to know how they want their development environment to be like and based on the answers It'll execute
the other Tiny CLIs to setup & configure different things based on the answers.

![terminal screenshot](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/images/npx-create-prisma-generator.png)

## What are the packages that starts with cpg?

> **cpg** is an acronym that stands for **Create Prisma Generator**

Those folders contain scoped npm packages under [**@cpg-cli** organization](https://www.npmjs.com/org/cpg-cli) and those packages are basically **Tiny CLIs** that are responsible for configuring or copying templates(files/folders) to a desired location and are executed by the main CLI `create-prisma-generator` as shell commands.

## Why splitting templates/configs into different packages?

1. This ensures that developers only download what they asked for.
2. Shrinks the main CLI size.
3. Splitting them actually eliminates the need for updating the CLI to get the latest templates/configs cause the main CLI uses the latest versions of the Tiny CLIs to ensure that developers always get the latest templates/configs with the same `create-prisma-generator` version.
4. Control over managable tiny pieces.
5. If a developer needed a specific config after setting up his project, He can use one of the tiny CLIs to setup it in his existing project.
