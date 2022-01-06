# Reference

## `logger`

a simple utility to print colorized messages to the terminal formatted like that:

`prisma:type` Message

### Usage

```ts
logger.info(`${GENERATOR_NAME}:Registered`)
```

## `getDMMF`

This is a great utility function that comes in handy especially when writting tests when you've a `sample.prisma` and want to get DMMF from it without running `prisma generate` and go through this cycle 👎:

```
@prisma/cli -> @prisma/sdk -> Spawns Generators -> Send DMMF through RPCs
```

a better approuch is to cut this cycle and just get the utility function in `@prisma/sdk` that's responsible for generating the DMMF from a prisma definitions string.

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

## `highlightSql`, `highlightDatamodel` & `highlightTS`

Those are some utility functions that are used to highlight code snippets that can be then outputted to the terminal

### Usage

```ts
const requiredDataModel = `generator client {
  provider = "prisma-client-js"
}`

console.log(highlightDatamodel(requiredDataModel))
```
