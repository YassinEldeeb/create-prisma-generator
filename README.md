![Banner Image](https://github.com/YassinEldeeb/create-prisma-generator/blob/main/images/cool-banner.png)

<div align="center">
  <a href="https://www.npmjs.com/package/create-prisma-generator"><img src="https://img.shields.io/npm/v/create-prisma-generator.svg?style=flat" /></a>
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

Generators will always be called when you run prisma generate. However, only the generators mentioned in the schema.prisma file are being run.

[See the full Article about Prisma Generators](https://prismaio.notion.site/Prisma-Generators-a2cdf262207a4e9dbcd0e362dfac8dc0)

# why?
As a community, developing prisma generators is really hard cause there is nothing documented about [@prisma/sdk](https://www.npmjs.com/package/@prisma/sdk) nor [@prisma/generator-helper](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwj07PXhlYD1AhUHkhQKHQ9WAMgQFnoECAgQAQ&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40prisma%2Fgenerator-helper&usg=AOvVaw3JS07ZjHOiV5HmyvNRxTUs) and the only way you can get started is by looking at [other generators](https://www.prisma.io/docs/concepts/components/prisma-schema/generators#community-generators) code which might be useful.

I'm really obsessed with this architecture that Prisma Client is built on and I can see a bright future for Prisma Generators from the community to integrate Prisma nicely with different frameworks or make tools that beneift from Prisma models.

But unfortunately I didn't have a smooth experience developing [my prisma generator](https://github.com/YassinEldeeb/prisma-tgql-types-gen).

So I created this CLI to help developers getting started developing their Prisma Generators smoothly with all of the annoying repetitive things carried away like:
- Publishing the generator to npm.
- Testing environment.
- Boilerplates for Typescript/Javascript W/Babel.
- CI for Testing and Publishing.
- Keeping dependencies up to date.
- Workspace for testing the generator locally using `prisma generate`.
- Best Practices for developing Prisma Generators.

### Also Created a blog on dev.to to help you with the undocumented APIs that I've talked about previously and to explain the setup that this CLI has setup for you, [Check It out here](https://dev.to/yassineldeeb/create-prisma-generator-2mdg)

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
- Workspace setup for testing the generator locally.
- Scripts for development, building, packaging and testing.
- Support for most package-managers `yarn`, `pnpm` and `npm`.
- Automatic semantic release with safety in mind using [commitlint](https://github.com/conventional-changelog/commitlint) & [husky](https://github.com/typicode/husky) to validate your [commit messages](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format).
- Test environment using [Jest](https://github.com/facebook/jest) with an example & fixtures to help you get started.
- Dependabot for keeping dependencies up to date.

# Architecture
Read [Architecture.md](https://github.com/YassinEldeeb/prisma-tgql-types-gen/blob/main/ARCHITECTURE.md) to understand how everything is working.

# Community
The Create Prisma Generator community can be found on [GitHub Discussions](https://github.com/YassinEldeeb/create-prisma-generator/discussions), where you can ask questions, suggest ideas, and share your projects.

# Contributing
We'll be very thankful for all your contributions, whether it's for helping us find issues in our code, highlighting features that're missing, writing tests for uncovered cases, or contributing to the codebase.

Read the [Contributing guide](https://github.com/YassinEldeeb/prisma-tgql-types-gen/blob/main/CONTRIBUTING.md) to get started.
