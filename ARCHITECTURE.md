# Architecture

| CLIs | Short description |
| --- | --- |
| [create-prisma-generator](https://github.com/YassinEldeeb/create-prisma-generator/tree/main/packages/create-prisma-generator) | The main CLI that's responsible for prompting questions & executing other CLIs. |
| [@cpg-cli/template-typescript](https://github.com/YassinEldeeb/create-prisma-generator/tree/main/packages/cpg-template-typescript) | CLI that stores the typescript template and copies it to the desired location. |
| [@cpg-cli/template](https://github.com/YassinEldeeb/create-prisma-generator/tree/main/packages/cpg-template) | CLI that stores the javascript template and copies it to the desired location. |
| [@cpg-cli/root-configs](https://github.com/YassinEldeeb/create-prisma-generator/tree/main/packages/cpg-root-configs) | CLI that stores the shared root configs and copies it to the desired location. |
| [@cpg-cli/github-actions](https://github.com/YassinEldeeb/create-prisma-generator/tree/main/packages/cpg-github-actions) | CLI that stores the github actions template and copies it to the desired location. |
| [@cpg-cli/semantic-releases](https://github.com/YassinEldeeb/create-prisma-generator/tree/main/packages/cpg-semantic-releases) | CLI that configs the current project to support [`semantic-release`](https://github.com/semantic-release/github) and add commit-msg safety. |
| [@cpg-cli/template-gen-usage](https://github.com/YassinEldeeb/create-prisma-generator/tree/main/packages/cpg-template-gen-usage) | CLI that stores the generator usage template and copies it to the desired location. |


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

All of those Tiny CLIs packages are bootstrapped by [this script](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/scripts/addNewTemplate.ts) which follow the same structure

the template folder contains files/folders that are copied to the desired location as provided in the first argument when running the CLI.

```
packages
└── cpg-new-template
    ├── index.js
    ├── bin.js
    ├── package.json
    └── template
```

## But hey why typescript/javascript templates use hardcoded versions for their dependencies?

At first you might see this approach super wrong and think of why not installing the latest versions of the dependencies but this is the same approuch used in [create-react-app](https://github.com/facebook/create-react-app/blob/main/packages/cra-template-typescript/template.json) but why?

This approuch called Locking dependencies which means to set hardcoded versions for external/untrusted packages that can break unexpectedly with any release.

### but then, How those dependencies can be updated? manually?
Dependabot is [configured](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/.github/dependabot.yml) to watch dependencies in every `package.json` that's located under a template folder which run before committing using [Husky](https://github.com/typicode/husky).

Dependabot is configured programmatically using [this script](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/scripts/guideDependabot.ts), We're not doing anything manually here 😄.

Dependabot is gonna PR me with the latest versions of the dependencies **weekly** so I can review and merge them which will update the templates' package.json(s) and publish them automatically using [this github action workflow](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/.github/workflows/publish.yml)

## Why splitting templates/configs into different packages?

1. This ensures that developers only download what they asked for.
2. Shrinks the main CLI size.
3. Splitting them actually eliminates the need for updating the CLI to get the latest templates/configs cause the main CLI uses the latest versions of the Tiny CLIs to ensure that developers always get the latest templates/configs with the same `create-prisma-generator` version.
4. Control over managable tiny pieces.
5. If a developer needed a specific config after setting up his project, He can use one of the tiny CLIs to setup it in his existing project.

## What's the `dev.to` directory in the root?

This stores the blogs published to [dev.to/YassinEldeeb](https://dev.to/YassinEldeeb) where I explain more about the generated boilerplate and prisma generators.

Those blogs are updated automatically via [this github action workflow](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/.github/workflows/update-blogs.yml).

This enable a waterfall of features that couldn't be possible before:
1. History of changes, compare when editing.
2. Using [prettier](https://github.com/prettier/prettier) to format the markdown and all the code snippets.
3. Letting people contribute to the blogs by creating a PR against it.
4. Managing code examples and update them easier, Thanks to [Embedme](https://github.com/zakhenry/embedme)
