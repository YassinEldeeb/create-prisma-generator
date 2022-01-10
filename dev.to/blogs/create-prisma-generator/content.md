---
published: false
title: 'Create Prisma Generator'
cover_image: 'https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/images/cool-banner.png'
description: 'Introducing create-prisma-generator CLI and explaining the boilerplate'
tags: typescript, javascript, prisma, generator
series: create-prisma-generator
---

This blog is hosted on [this github repo](https://github.com/YassinEldeeb/create-prisma-generator/tree/main/dev.to/blogs/create-prisma-generator) in `content.md` file so feel free to correct me when I miss up by making a PR there.

## What's a prisma generator?

Prisma has a concept called "Generator". A generator is an executable program, which takes the parsed Prisma schema as an input and has full freedom to output anything.

The most prominent generator is called [`prisma-client-js`](https://github.com/prisma/prisma/tree/main/packages/client). It's the ORM Client powering the main TypeScript and JavaScript usage of Prisma from Node.js.

Generators will always be called when you run `prisma generate`. However, only the generators mentioned in the `schema.prisma` file are being run.

[Strongly recommend reading the full article, It's pretty damn good](https://prismaio.notion.site/Prisma-Generators-a2cdf262207a4e9dbcd0e362dfac8dc0)

From our perspective as a community when integrating prisma in different environments you'll often notice that there's a thing that you always go to change after modifying your prisma schema in your codebase, and that's when great developers realize that this thing should be automated to eliminate the problem of maintaining two or more different sources of the same definitions.

## Getting Started

Now that you've a high level overview of what a prisma generator is, lets discuss the hello world prisma generator you'll get when using create-prisma-generator CLI 💪

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

### @prisma/generator-helper

The generator has to be an executable binary somewhere in the filesystem. This binary, for example `./my-gen` needs to implement a JSON RPC interface via stdio.

> When `@prisma/sdk` spawns our generator, It uses [RPCs](https://en.wikipedia.org/wiki/JSON-RPC) to communicate with our generator to send it the parsed datamodel AST as an example.

Luckily for us, prisma has wrote a helper library called `@prisma/generator-helper`. It takes all the work of implementing the interface and gives us simple callbacks where we can implement our business logic.

And as you can see, It has a callback called `generatorHandler` which takes two methods:

#### `onManifest:`

When running the prisma cli with the following command `prisma generate` It gets our generator manifest as defined below which contains all of the information about our generator like It's name, version, default output, which binaries and which version the generator needs.

#### `onGenerate:`

This is a callback method that run when `@prisma/sdk` calls it with the correct arguments that contains the parsed datamodel AST, generator options and other useful information.

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
  onGenerate: async (options: GeneratorOptions) => {
    options.dmmf.datamodel.enums.forEach(async (enumInfo) => {
      const tsEnum = genEnum(enumInfo)

      const writeLocation = path.join(
        options.generator.output?.value!,
        `${enumInfo.name}.ts`,
      )

      await writeFileSafely(writeLocation, tsEnum)
    })

    logger.info(`${GENERATOR_NAME}:Generated Successfuly!`)
  },
})
```
