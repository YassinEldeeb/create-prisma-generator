import { logger } from '@prisma/sdk'
import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { GENERATOR_NAME } from './constants'
import { writeFileSafely } from './utils/writeFileSafely'
import path from 'path'

logger.info(`${GENERATOR_NAME}:Registered`)

generatorHandler({
  onManifest: () => ({
    defaultOutput: '../generated',
    prettyName: GENERATOR_NAME,
    requiresGenerators: ['prisma-client-js'],
  }),
  onGenerate: async (options: GeneratorOptions) => {
    options.dmmf.datamodel.enums.forEach(async ({ name, values }) => {
      const enumValues = values
        .map(({ name }) => `${name}="${name}"`)
        .join(',\n')
      const tsEnum = `enum ${name} { \n${enumValues}\n }`

      const outputPath =
        path.join(process.cwd(), options.generator.config.outputPath) ||
        options.generator.output?.value!

      await writeFileSafely(path.join(outputPath, `${name}.ts`), tsEnum)
    })

    logger.info(`${GENERATOR_NAME}:Generated Successfuly!`)
  },
})
