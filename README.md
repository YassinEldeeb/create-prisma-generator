![Banner Image](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/images/cool-banner.png)

<div align="center">
  <a href="https://www.npmjs.com/package/create-prisma-generator"><img src="https://img.shields.io/npm/v/create-prisma-generator.svg?style=flat" /></a>
  <a href="https://npmcharts.com/compare/create-prisma-generator?minimal=true"><img src="https://img.shields.io/npm/dm/create-prisma-generator.svg?style=flat"/></a>
  <a href="https://github.com/YassinEldeeb/create-prisma-generator/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/YassinEldeeb/create-prisma-generator/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <br />
  <br />
  <a href="https://github.com/YassinEldeeb/create-prisma-generator#Usage">Usage</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://dev.to/yassineldeeb">Blog</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/YassinEldeeb/create-prisma-generator/blob/main/ARCHITECTURE.md">Architecture</a>
  <br />
  <hr />
</div>

## Prisma

> [Prisma](https://www.prisma.io/) is Database ORM Library for Node.js, Typescript.

Prisma has a concept called "Generator". A generator is an executable program, which takes the parsed Prisma schema as an input and has full freedom to output anything.

The most prominent generator is called [`prisma-client-js`](https://github.com/prisma/prisma/tree/main/packages/client). It's the ORM Client powering the main TypeScript and JavaScript usage of Prisma from Node.js.

Generators will always be called when you run `prisma generate`. However, only the generators mentioned in the schema.prisma file are being run.

[Strongly recommend reading the full article, It's pretty good](https://prismaio.notion.site/Prisma-Generators-a2cdf262207a4e9dbcd0e362dfac8dc0)

# why?
As a community, developing prisma generators is really hard cause that's a very new concept to us so It's like knowing JS but being exposed to do ML with it for the first time and there is nothing documented about **@prisma/sdk** ([this is done intentionally](https://github.com/prisma/prisma/discussions/10721#discussioncomment-1822836)) which has a very great utilities when developing or testing prisma generators and the only way you can get started is by looking at [other generators](https://www.prisma.io/docs/concepts/components/prisma-schema/generators#community-generators) code which might be useful to get you started.

I'm really obsessed with this architecture that Prisma Client is built on and I can see a bright future for Prisma Generators from the community to integrate Prisma nicely with different frameworks or make tools that can beneift from Prisma models.

But unfortunately I didn't have a smooth experience developing [my prisma generator](https://github.com/YassinEldeeb/prisma-tgql-types-gen).

So I created this CLI to encourage developers to make their own prisma generators to automate things that are repeatable/annoying by making a worflow for them to have a smooth experience with all of the annoying repetitive things carried away like: getting started boilerplate, publishing, testing the gen locally by running `prisma generate`, ..etc

### Also Created a blog on dev.to where we're gonna be building a prisma generator together to explain the boilerplate that this CLI has setup for you and the different concepts you'll come across when developing prisma generators, [Check It out here](https://dev.to/yassineldeeb/create-prisma-generator-2mdg)

# Usage

Answer the prompt questions to setup your project, The project setup will be based on your answers.

```sh
npx create-prisma-generator
```

# What’s Included?

Your environment will have everything you need to build your prisma generator like an elite open-source maintainer:
- Hello World Prisma Generator.
- Typescript Support.
- JavaScript setup with babel to enable the usage of the latest JS features.
- Automatic publishing workflow with Github Actions.
- Workspace setup for testing the generator locally using `prisma generate`.
- Scripts for development, building, packaging and testing.
- Support for most package-managers `yarn`, `pnpm` and `npm`.
- Automatic semantic release with safety in mind using [commitlint](https://github.com/conventional-changelog/commitlint) & [husky](https://github.com/typicode/husky) to validate your [commit messages](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format).
- Test environment using [Jest](https://github.com/facebook/jest) with an example & fixtures to help you get started.
- Dependabot for keeping dependencies up to date.

# Architecture
Read [Architecture.md](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/ARCHITECTURE.md) to understand how everything is working.

# Community
The Create Prisma Generator community can be found on [GitHub Discussions](https://github.com/YassinEldeeb/create-prisma-generator/discussions), where you can ask questions, suggest ideas, and share your projects.

# Contributing
We'll be very thankful for all your contributions, whether it's for helping us find issues in our code, highlighting features that're missing, writing tests for uncovered cases, or contributing to the codebase.

Read the [Contributing guide](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/CONTRIBUTING.md) to get started.

### 💚 All Thanks to Prisma's brilliant developers for making such an awesome Node.js ORM that can be easily built on top of it.
