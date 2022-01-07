# How do I Contribute 💪

we're excited to have you on board!

- Take a look at the existing [Issues](https://github.com/YassinEldeeb/create-prisma-generator/issues) or [create a new issue](https://github.com/YassinEldeeb/create-prisma-generator/issues/new)!
- Fork the Repo. Then, create a branch for any issue that you are working on. Finally, commit your work.
- Create a **[Pull Request](https://github.com/YassinEldeeb/create-prisma-generator/compare)**, which will be promptly reviewed and given suggestions for improvements.

## Architecture

Look at the [`ARCHITECTURE.md`](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/ARCHITECTURE.md) to understand how everything is working.

## Prerequisites

1. Node.js version installed, [latest LTS is recommended](https://nodejs.org/en/about/releases/)
2. Install [pnpm](https://pnpm.io) (for installing npm dependencies, using pnpm workspaces)

## How to start developing?

Setup and install the needed dependencies for all the packages by following these steps:

```sh
git clone https://github.com/YassinEldeeb/create-prisma-generator.git
cd create-prisma-generator
pnpm i
```

## Add a new template

To make a new template, You need to setup a new package simply by running the following command:

```sh
pnpm new-template ${template-name}
```

This script will make a new package at `packages/${template-name}` with all of the boilerplate for you to start adding your template

```diff
packages
+└── cpg-new-template
+    ├── index.js
+    ├── bin.js
+    ├── package.json
+    └── template
```

The generated package contains `index.js` and that acts like a tiny CLI that takes a path as the first argument to identify where to copy the template to.

Note that you can do whatever you want with this CLI like configuring existing files but this is just the default boilerplate that's most commonly used.

> ⚠ `index.js` has to be named exactly like this and export a default function cause tests depends on it when mocking `child_process` executed CLIs.
> If you're interested you can see the [whole shebang](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/packages/create-prisma-generator/src/__tests__/e2e/check-boilerplate-output.test.ts#L96-L122)
```js
const path = require('path')
const fs = require('fs')

const setup = () => {
  function copySync(from, to) {
    fs.mkdirSync(to, { recursive: true })
    fs.readdirSync(from).forEach((element) => {
      if (fs.lstatSync(path.join(from, element)).isFile()) {
        fs.copyFileSync(path.join(from, element), path.join(to, element))
      } else {
        copySync(path.join(from, element), path.join(to, element))
      }
    })
  }

  copySync(
    path.join(path.join(__dirname, `./template`)),
    path.join(process.cwd(), process.argv[2]),
  )
}

module.exports = setup
```

now you can place whatever configs, files, ..etc in the template directory and then PR me so I can review it and gratefully accept
it where It can be published to npm as a scoped package under [`@cpg-cli`](https://www.npmjs.com/org/cpg-cli)
organization by a [`Github Actions`](https://github.com/features/actions) workflow.

**Yeah It's now published to npm but isn't it now just acts like a host to my files, like... how to transfer them to the actual CLI generated boilerplate?**

That's a really good question, I'm glad you've asked it

## Use Templates in `create-prisma-generate`

In `packages/create-prisma-generator` is where everything takes place, It's the CLI that's responsible for:

1. prompting the questions
2. validating answers
3. configuring the boilerplate
4. executing shell commands to run certain **Tiny CLIs** to do setup things based on the project's information

### So first:

open `packages/create-prisma-generator/src/utils/promptQuestions.ts` this file contains all of the questions that are prompt to the developers to setup their customized
project.

This is using [Inquirer.js](https://github.com/SBoudrias/Inquirer.js), here you can edit the questions or ask more questions (which
I wouldn't recommend that much cause It would be too annoying to answer all of these questions to get a project setup) to satisfy your needs.

After that you can open `packages/create-prisma-generator/src/index.ts`, here you can find the `promptQuestions()` function we've just discussed that'll return us all
of the developer's answers about the project setup.

And so looking at the written examples you'll see syntax like this frequently, so the `runBlockingCommand(templateName, command, ?type)` function is a synchronous function
that'll call `execSync` from node's child_process to execute a shell command that'll use our tiny CLIs to setup the different pieces of our boilerplate.

```ts
const templateName = 'root default configs'
runBlockingCommand(templateName, CLIs.rootConfigs(pkgName))
```

And `CLIs` is just an object that has a bunch of methods to execute the Tiny CLIs which you'll have to add your own here as well

```ts
// packages/create-prisma-generator/src/tinyClis.ts
export const CLIs = {
  typescriptTemplate(path: string) {
    return `npx @cpg-cli/template-typescript ${path}`
  },
  rootConfigs(path: string) {
    return `npx @cpg-cli/root-configs ${path}`
  },
  usageTemplate(path: string) {
    return `npx @cpg-cli/template-gen-usage ${path}`
  },
  javascriptTemplate(path: string) {
    return `npx @cpg-cli/template ${path}`
  },
  githubActionsTemplate(path: string) {
    return `npx @cpg-cli/github-actions ${path}`
  },
  setupSemanticRelease(path: string, workspaceFlag: string) {
    return `npx @cpg-cli/semantic-releases ${path} ${workspaceFlag}`
  },
}
```

so now It just depends on what you're setting up, you're now equiped with all of the tools/utilities to support other things like other CIs as an example cause currently
`Github Actions` is the only supported CI.

# How to run create-prisma-generator in development?

The setup I would recommend is running `pnpm dev` in `packages/create-prisma-generator` in a terminal and open another one and `cd packages/cli-usage` where you can find an empty package that has a single purpose of testing your changes to all of the other `packages`.

So if you opened `packages/cli-usage/package.json` you'll see all of the packages linked locally from the workspace **which you'll find your own there as well cause the script you ran at first added it automatically**

```json
"devDependencies": {
    "create-prisma-generator": "workspace:*",
    "@cpg-cli/semantic-releases": "workspace:*",
    "@cpg-cli/github-actions": "workspace:*",
    "@cpg-cli/template": "workspace:*",
    "@cpg-cli/template-gen-usage": "workspace:*",
    "@cpg-cli/template-typescript": "workspace:*",
    "@cpg-cli/root-configs": "workspace:*"
  }
```

so after you make changes to any of the listed packages you just run `pnpm cli` to test the main `create-prisma-generator` cli that would execute all of the other tiny CLIs.
