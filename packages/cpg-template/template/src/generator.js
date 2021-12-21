import { generatorHandler } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import path from 'path'
import { GENERATOR_NAME } from './constants'
import { genEnum } from './helpers/genEnum'
import { writeFileSafely } from './utils/writeFileSafely'

logger.info(`${GENERATOR_NAME}:Registered`)

generatorHandler({
  onManifest: () => ({
    defaultOutput: '../generated',
    prettyName: GENERATOR_NAME,
    requiresGenerators: ['prisma-client-js'],
  }),
  onGenerate: async (options) => {
    options.dmmf.datamodel.enums.forEach(async (enumInfo) => {
      const tsEnum = genEnum(enumInfo)

      const outputPath =
        path.join(process.cwd(), options.generator.config.outputPath) ||
        options.generator.output?.value

      await writeFileSafely(
        path.join(outputPath, `${enumInfo.name}.ts`),
        tsEnum,
      )
    })

    logger.info(`${GENERATOR_NAME}:Generated Successfuly!`)
  },
})
