# Prisma SDK Reference (v3.6.0)

> ⚠ WARNING: `@prisma/sdk` is an internal API that's not supposed to be used outside of prisma's fence as [mentioned in this issue](https://github.com/prisma/prisma/issues/10725)
>
> It's not recommended to fully document `@prisma/sdk` as it might change unexpectedly or be deleted entirely so if you wanna contribute, please keep it simple and don't dig deep.
> 
> These are some of the most important Utilities when developing prisma generators that can save you some time.
> 
> This was documented by someone who doesn't work at prisma but a big fan so I think I'm qualified to document some parts of this internal API 🤷‍♂️


## `logger`

a simple wrapper around [`chalk`](https://github.com/chalk/chalk) to print colorized messages to the terminal formatted like that:

`prisma:type` Message

### Usage

```ts
const GENERATOR_NAME = 'prisma-generator-seeder'

logger.info(`${GENERATOR_NAME}:Registered`)
```

## `getDMMF`

this is a very great utility function that comes in handy especially when writting tests when you've a `sample.prisma` and want to get DMMF from it without running `prisma generate` and go through this cycle 👎:

```sh
@prisma/cli -> @prisma/sdk -> Spawns Generators -> Send DMMF through RPCs
```

a better approach is to cut this cycle and just get the utility function in `@prisma/sdk` that's responsible for generating the DMMF from a prisma definitions string.

This function calls a rust binary that introspects the prisma definations in the string and gives back a nice AST([Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)) for the defined definations in prisma modelling language.

> ⚠️ Note: The DMMF is a Prisma ORM internal API with no guarantees for stability to outside users. They might - and do - change the DMMF in potentially breaking ways between minor versions.

### Usage

```ts
const samplePrismaSchema = fs.readFileSync(
  path.join(__dirname, './sample.prisma'),
  'utf-8',
)

const sampleDMMF = getDMMF({
  datamodel: samplePrismaSchema,
})
```

## `getSchema` & `getSchemaSync`
shortcut for `fs.readFileSync(path,'utf-8')`, It takes a path for the prisma definitions file and returns a string of it's contents.

### Usage

```ts
// Sync
const schema = getSchemaSync(path.join(__dirname, './sample.prisma'))

// Async
const schema2 = await getSchema(path.join(__dirname, './sample2.prisma'))
```

## `getPlatform`
a better formatted version of `process.platform` that's responsible for getting the current operating system of the running process.

### Usage

```ts
const platform = await getPlatform()
```

## `isCi`
a simple wrapper around [`ci-info`](https://github.com/watson/ci-info) to get a boolean if wether or not the generator is running in a CI environment.

### Usage

```ts
if(isCi() || process.env.NODE_ENV === 'production') {
  return
}
```

## `drawBox`
a great utility for drawing boxes that can be useful for showing messages if there're any breaking changes or uncompatibility issues.

**Notes:**

anyVerticalValue = number of lines

anyHorizontalValue = number of space chars

### Usage

```ts
const incompatibilityErrorMessage = drawBox({
  title: 'Unsupported Node.js version',
  str: `prisma-generator-seeder only supports Node.js >= 14.3`,
  horizontalPadding: 3,
  height: 1,
  width: 74,
})

console.log(incompatibilityErrorMessage)
```

## `highlightSql`, `highlightDatamodel` & `highlightTS`

Those are some utility functions that are used to highlight code snippets that can be then outputted to the terminal

### Usage

```ts
const requiredDataModel = `generator client {
  provider = "prisma-client-js"
}`

console.log(highlightDatamodel(requiredDataModel))
```

# Credits

This API reference probably wouldn't exist without the help of [`Github Code Search`](https://www.youtube.com/watch?v=UOIPBfPXkus) which I got my preview license to try it the day I wrote this documentation and It helped me a lot in searching the different parts in `@prisma/sdk` in Prisma's code base to see how they're used and in which cases.
