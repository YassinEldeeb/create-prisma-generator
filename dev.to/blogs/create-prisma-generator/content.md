---
published: false
title: 'Create Prisma Generator'
cover_image: 'https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/images/cool-banner.png'
description: 'Introducing create-prisma-generator CLI and explaining the boilerplate'
tags: typescript, javascript, prisma, generator
series: create-prisma-generator
---

This blog is hosted on [this github repo](https://github.com/YassinEldeeb/create-prisma-generator/tree/main/dev.to/blogs/create-prisma-generator) in `content.md` file so feel free to correct me when I miss up by making a PR there.

## What's a prisma generator? 🤔

Prisma has a concept called "Generator". A generator is an executable program, which takes the parsed Prisma schema as an input and has full freedom to output anything.

The most prominent generator is called [`prisma-client-js`](https://github.com/prisma/prisma/tree/main/packages/client). It's the ORM Client powering the main TypeScript and JavaScript usage of Prisma from Node.js.

Generators will always be called when you run `prisma generate`. However, only the generators mentioned in the `schema.prisma` file are being run.

[Strongly recommend reading the full article, It's pretty damn good](https://prismaio.notion.site/Prisma-Generators-a2cdf262207a4e9dbcd0e362dfac8dc0)

From our perspective as a community when integrating prisma in different environments you'll often notice that there's a thing that you always go to change after modifying your prisma schema in your codebase, and that's when great developers realize that this thing should be automated to eliminate the problem of maintaining two or more different sources of the same definitions.

## Getting Started

Now that you've a high level overview of what a prisma generator is, let's discuss the hello world prisma generator you'll get when using create-prisma-generator CLI 💪

I made it so that it requires the least amount of effort to start developing your own prisma generator.

Answer the prompt questions to setup your project, The project setup will be based on your answers.

> Note: "? setup workspace for testing the generator" means to symlink the generator with another sample usage project so that when you run `prisma generate` from your terminal, It uses the local generator in the workspace which is very useful when developing, I strongly recommend it.

```sh
$ npx create-prisma-generator
```

I'll go and answer Yes for everything to go with the full capabilities of this CLI but you can follow along with your setup too.

![my-answers-to-questions](https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/dev.to/blogs/create-prisma-generator/assets/my-questions-answers.png)

And once you see the success message in your terminal saying that your project is now ready, open the project in your favourite IDE and let's have some fun 😉

First let's open the `schema.prisma` which you can find it at `packages/usage/prisma/schema.prisma`.

You'll notice your generator there symlinked with the generator code in the workspace

> Note: the provider can differ from package manager to another, here I chose `pnpm`

```ts
generator custom_generator {
  provider = "npx my-gen"
  output   = "../types"
}
```

You'll also see some enums there, that's because the hello world generator that you get from running `create-prisma-generator` is for generating Typescript Enums from `schema.prisma`.

Now let's run the `prisma generate` command which should run all of the generators listed in `schema.prisma`:

```sh
cd packages/usage
npx prisma generate
```

Oh, WOW! the types directory wasn't there before, what the hell happened!

You can see that the `types` directory was generated after running `prisma generate` which contains all of the different enums defined in `schema.prisma` organized by an enum per file.

So if you opened any of the files in the `types` directory, you'll see an enum that matches exactly with the name and values as defined in `schema.prisma`

```ts
enum Language {
  Typescript = 'Typescript',
  Javascript = 'Javascript',
  Rust = 'Rust',
  Go = 'Go',
  Python = 'Python',
  Cpp = 'Cpp',
}
```

Noticed something? the output option in the `custom_generator` block in `schema.prisma` tells the generator where to output the generated files with a path relative to the directory where `schema.prisma` is located, try to change this option to something different like `../src/types` and run `npx prisma generate` again.

```ts
generator custom_generator {
  provider = "npx my-gen"
  output   = "../src/types"
}
```

You'll see that it created all of the directories for the defined path and outputted the generated enums there.

Now after we've played around with the Hello World generator, Let's take a look at the code for it.

You can find the generator code located under `packages/generator` directory.

Open `packages/generator/src/generator.(ts|js)` and let's slowly discuss what's in there.

At the top you'll see we're importing some strange modules like `@prisma/generator-helper`, `@prisma/sdk`, what are those?

## @prisma/generator-helper

The generator has to be an executable binary somewhere in the filesystem. This binary, for example `./my-gen` needs to implement a JSON RPC interface via stdio.

> When `@prisma/sdk` spawns our generator, It uses [RPCs](https://en.wikipedia.org/wiki/JSON-RPC) to communicate with our generator to send it the parsed datamodel AST as an example.

Luckily for us, prisma has wrote a helper library called `@prisma/generator-helper`. It takes all the work of implementing the interface and gives us simple callbacks where we can implement our business logic.

And as you can see, It has a callback called `generatorHandler` which takes two methods:

### `onManifest:`

When running the prisma cli with the following command `prisma generate` It gets our generator manifest that gets returned from the `onManifest` callback method which contains all of the information about our generator like It's name, version, default output, which binaries and which version the generator needs.

```ts
generatorHandler({
  onManifest() {
    return {
      ...
    }
  },
  ...
})
```

### `onGenerate:`

This is a callback method that run when `@prisma/sdk` calls it with the correct arguments that contains the parsed datamodel AST, generator options and other useful information.

```ts
generatorHandler({
  ...
  onGenerate: async (options: GeneratorOptions) => {
    ...
  },
})
```

## @prisma/sdk

This is an internal API that has some very cool utilities that are often used when developing prisma generators which I've documented some parts about it [here](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/PRISMA_SDK_REFERENCE.md).

## Back to our Hello World generator

After we've dicussed a bit about `@prisma/generator-helper` and `@prisma/sdk`, Let's get back to `generator.(ts|js)`

You'll first see that we're importing the generator's package.json and grabbing the version out if it to pass it as a part of the generator manifest,

then using the `GENERATOR_NAME` constant which is imported from `packages/generator/constants.ts` to log an info message to let us know when our generator is registred then returning an object expressing our generator manifest.

`version` and `prettyName` are used by `@prisma/sdk` when It calls `getGeneratorSuccessMessage` to generate a success message from our generator manifest like shown below.

![generator-success-message](https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/dev.to/blogs/create-prisma-generator/assets/generated-successfully.png)

`defaultOutput` is a fallback for the `output` option if It wasn't provided in the generator block.

```ts
const { version } = require('../package.json')

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`)
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  ...
}
```

Let's get to the `onGenerate` callback where you'll receive the generator options which you can find the latest type definitions [here](https://github.com/prisma/prisma/blob/main/packages/generator-helper/src/types.ts), this contains a lot of information for our generator to use like pure datamodel, dmmf, generator(config, name, output, provider), schemaPath, version and hell a lot more.

> DMMF?? It's the Datamodel Meta Format. It is an AST (abstract syntax tree) of the datamodel in the form of JSON.

You can see that we're specifically making use of `options.dmmf.datamodel.enums` which contains all of the parsed enums as AST that we can then have full freedom of outputting anything with this information.

We're using a helper function that can be found in `packages/generator/src/helpers/genEnum.(ts|js)` that takes the enum information and gives us back a string containing a Typescript Enum.

```ts
generatorHandler({
  ...
  onGenerate: async (options: GeneratorOptions) => {
      options.dmmf.datamodel.enums.forEach(async (enumInfo) => {
      const tsEnum = genEnum(enumInfo)

      const writeLocation = path.join(
        options.generator.output?.value!,
        `${enumInfo.name}.ts`,
      )

      await writeFileSafely(writeLocation, tsEnum)
    })
  },
})

```

Nothing crazy to make a Typescript Enum from the enum info, you can take a look at the file, It's really really simple.

```ts
export const genEnum = ({ name, values }: DMMF.DatamodelEnum) => {
  const enumValues = values.map(({ name }) => `${name}="${name}"`).join(',\n')

  return `enum ${name} { \n${enumValues}\n }`
}
```

Another thing you'll see is a utility function called `writeFileSafely` which takes the write location for the file and the content for that file then It creates all of the directories recursivly following the write location path and uses another utility function called `formatFile` to format the content using prettier before writing the file to the specified path.

```ts
export const writeFileSafely = async (writeLocation: string, content: any) => {
  fs.mkdirSync(path.dirname(writeLocation), {
    recursive: true,
  })

  fs.writeFileSync(writeLocation, await formatFile(content))
}
```

And that's it, that's our Hello World generator, hope It was a fun ride.

## Testing 🧪

Quality Software can't be shipped directly to the users and have to be well tested before It goes live.

That's why I've included jest in any project that gets bootstrapped by `create-prisma-generator` CLI.

> If you don't know what jest is? It's a JavaScript Testing Framework [learn more about it here](https://jestjs.io/docs/getting-started)

There's a very simple test located under `packages/generator/__tests__/` called `genEnum.test.ts`, If you opened this file you'll see a test written that compares the generated output of the genEnum() helper function we've talked about previously with the already taken snapshot of a working version of this function.

We can run that test by running the following command in `packages/generator` directory:

```sh
# You can use whatever package manager to run the test script
pnpm test
```

You'll see all of the tests are passing, that means our software is ready to be shipped! 🥳

![generator-success-message](https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/dev.to/blogs/create-prisma-generator/assets/passing-tests.png)

You can also see that we're not getting the DMMF from `@prisma/sdk`, mmm... that's strange but how are we getting the DMMF from a `schema.prisma` and where is even that `schema.prisma` file?

Usually in production the DMMF gets sent through this cycle:

```sh
@prisma/cli -> @prisma/sdk -> Spawns Generators -> Send DMMF through RPCs
```

Which works perfectly fine but not the ideal when testing prisma generators, we can cut this cycle and just get the utility function in @prisma/sdk that's responsible for generating the DMMF from a prisma definitions string which called `getDMMF`.

So as you can see we're calling `getSampleDMMF()` from the fixtures defined in the tests directory which then reads the `sample.prisma` located under `__tests__/__fixtures__/` and parse it to an AST exactly like the one we get normally in a production environment.

And now It's up to you to write tests for your own generator.

I'm curios to see your creative solutions for testing your prisma generator 🤗.

## Fancy Stuff ✨

Now let's get fancy with the full capabilities of this CLI and manage this project like an elite open source programmer 💪.

### Auto Publishing 🚀

Remember the "automate publishing the generator with Github Actions" I've said yes to it at first.

That had setup a Github Actions workflow at `.github/workflows/CI.yml` which will run all of our generator tests then if they're all passing It will publish the package to npm using your Access Token.

To get an access token, you must first be logged in with your npm account or [register here](https://www.npmjs.com/signup)

Then click on your profile picture and go to "Access Tokens" like shown in the screenshot below 👇

![npm-profile-dropdown](https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/dev.to/blogs/create-prisma-generator/assets/npm-dropdown.png)

Click on "Generate New Token" and select the token type to be "Automation" so that you don't require 2FA when running in a CI environment.

![npm-profile-dropdown](https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/dev.to/blogs/create-prisma-generator/assets/create-npm-token.png)

Before start publishing your package to npm, you'll need to replace the placeholders in `packages/generator/package.json` with actual information like: description, homepage, repository, author and keywords.
Check the docs to know what all of those fields mean [npm package.json docs](https://docs.npmjs.com/cli/v8/configuring-npm/package-json).

Now that you've your npm access token you can create a new github repository and add a new secret to your github actions secrets with this exact same name `NPM_TOKEN`.

![npm-profile-dropdown](https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/dev.to/blogs/create-prisma-generator/assets/add-secrets-to-github.png)

Let's make a small change to this generator like changing the name of the generator as an example.

```diff
- export const GENERATOR_NAME = 'my-gen'
+ export const GENERATOR_NAME = 'my-super-gen'
```

Then commit & push to your repository on the `main` branch

```sh
git add .
git commit -m"fix: generator name"
git push -u origin main
```

After you push, go to your repository on github specifically on tha `Actions` tab and you'll immediately see the tests running and after they finish, the package will be published to npm with the version specified in the generator's package.json using your access token which you can then find using the following url `https://www.npmjs.com/package/$your-generator-name` 🥳.

![github-actions.png](https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/dev.to/blogs/create-prisma-generator/assets/add-secrets-to-github.png)

### Automatic Semantic Versioning 🤖

Don't know what semantic versioning is?, Mahmoud Abdelwahab got you covered with a 1 minute video about it [check it out](https://www.youtube.com/watch?v=5NQUut8uf9w)

Now we've a workflow for testing and automatic publishing the package to npm but It's not very nice having to go and manually bump the version in the `package.json` everytime you change something and wanna publish it.

Using [semantic-release](https://github.com/semantic-release/semantic-release), we can just focus on our commit messages and It'll do the rest of the work for us like: bumping the version, github release, git tag, generating a CHANGELOG and a lot more.

Remember the "(Github Actions) setup automatic semantic release" I've said yes to it at first.

That had setup semantic-release for me with the Github Actions workflow and added husky with commitlint to force [Conventional Commit Messages](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format) which then semantic-release will recognize and decide the next version based on it and do all of the stuff for us.

But there's a very small configuration we still need to make for this to work as intended.

Remember when I said:

> bumping the version, github release, git tag, generating a CHANGELOG and a lot more.

Well, semantic-release needs read/write access over public/private repos to achieve all of that.

Create a new github access token [from this link](https://github.com/settings/tokens/new?scopes=repo) providing a note for it so you can remember what it was for.

Now that you've your github access token you can add a new secret to your github actions secrets with this exact same name GH_TOKEN which semantic-release will look for to do all of the magic for us.

Let's make a smalll change to this generator like changing the name of the generator as an example and call it a minor release.

```diff
  generatorHandler({
  onManifest() {
-   logger.info(`${GENERATOR_NAME}:Registered`)
+   logger.info(`${GENERATOR_NAME}:Hooked`)
```

Then commit & push to your repository on the `main` branch

```sh
git add .
git commit -m"new register message"
git push -u origin main
```

Oh crab what the hell is this?
![husky-with-commitlint](https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/dev.to/blogs/create-prisma-generator/assets/husky-with-commitlint.png)

Remember when I told you that this CLI has setup husky with commitlint to validate your commit messages if it was conventional or not before commiting so that semantic-release can decide what the next version is based on your commit messages.

Now let's run a proper conventional commit message

```sh
git add .
git commit -m"feat: new register message"
git push -u origin main
```

After you push, go to your repository on github specifically on tha Actions tab and you'll see the same running tests and after they finish, you'll notice something different, semantic-release has bumped the version to `1.1.0` and modified the package.json version to sync it with npm, generated a CHANGELOG for you, created a new tag and published a github release for you 🤯

![github-actions.png](https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/dev.to/blogs/create-prisma-generator/assets/github-release.png)

![semantic-release-generated-changelog](https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/dev.to/blogs/create-prisma-generator/assets/commit-change-log.png)

WOW! I had a 0.01% chance that someone can read through all of that till the very end. I'm very proud of you, please mention or DM me on twitter and let me know you're one of the 0.01% of people.
