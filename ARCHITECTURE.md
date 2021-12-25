# Architecture

## create-prisma-generator
This package is the `main CLI` that prompt questions to developers to know how they want their development environment to be like.

![terminal screenshot](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/images/npx-create-prisma-generator.png)

And based on the answers It'll execute the other Tiny CLIs to setup & configure different things.
```ts
export const CLIs = {
  typescriptTemplate(path: string) {
    return `npx @cpg-cli/template-typescript@latest ${path}`
  },
  rootConfigs(path: string) {
    return `npx @cpg-cli/root-configs@latest ${path}`
  },
  usageTemplate(path: string) {
    return `npx @cpg-cli/template-gen-usage@latest ${path}`
  },
  javascriptTemplate(path: string) {
    return `npx @cpg-cli/template@latest ${path}`
  },
  githubActionsTemplate(path: string) {
    return `npx @cpg-cli/github-actions@latest ${path}`
  },
  setupSemanticRelease(path: string, workspaceFlag: string) {
    return `npx @cpg-cli/semantic-releases@latest ${path} ${workspaceFlag}`
  },
}
```

## What are the folders that starts with cpg?

> **cpg** is an acronym that stands for **Create Prisma Generator**

Those folders contain scoped npm packages under [**@cpg-cli** organization](https://www.npmjs.com/org/cpg-cli) and those packages are basically **Tiny CLIs** that are responsible for configuring or copying templates(files/folders) to a desired location and are executed by the main CLI `create-prisma-generator` as shell commands.

## Why splitting templates/configs into different packages?

1. This ensures that developers only download what they asked for.
2. Shrinks the main CLI size.
3. Splitting them actually eliminates the need for updating the CLI to get the latest templates/configs cause the main CLI uses the latest versions of the Tiny CLIs to ensure that developers always get the latest templates/configs with the same `create-prisma-generator` version.
4. Control over managable tiny pieces.
5. If a developer needed a specific config after setting up his project, He can use one of the tiny CLIs to setup it in his existing project.

## What's the `dev.to` directory in the root?

This stores the blogs published to [dev.to/YassinEldeeb](https://dev.to/YassinEldeeb) where I explain more about the generated boilerplate and prisma generators.

Those blogs are updated automatically via a github action workflow.

This enable a waterfall of features that couldn't be possible before:
1. History of changes, compare when editing.
2. Using [prettier](https://github.com/prettier/prettier) to format the markdown and all the code snippets.
3. Letting people contribute to the blogs by creating a PR against it.
4. Managing code examples and update them easier, Thanks to [Embedme](https://github.com/zakhenry/embedme)
