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
npx create-prisma-generator
```

I'll go and answer Yes for everything to go with the full capabilities of this CLI but you can follow along with your setup too.

![my-answers-to-questions](https://raw.githubusercontent.com/YassinEldeeb/create-prisma-generator/main/dev.to/blogs/create-prisma-generator/assets/my-questions-answers.png)
