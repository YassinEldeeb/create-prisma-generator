import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import path from 'path'
import { GENERATOR_NAME } from './constants'
import { genEnum } from './helpers/genEnum'
import { writeEnumFile } from './helpers/writeEnumFile'

logger.info(`${GENERATOR_NAME}:Registered`)

generatorHandler({
  onManifest: () => ({
    defaultOutput: '../generated',
    prettyName: GENERATOR_NAME,
    requiresGenerators: ['prisma-client-js'],
  }),
  onGenerate: async (options: GeneratorOptions) => {
     options.dmmf.datamodel.enums.forEach(async (enumInfo) => {
      const tsEnum = genEnum(enumInfo)

      writeEnumFile(enumInfo.name, tsEnum, options.generator.output?.value!)
    })

    logger.info(`${GENERATOR_NAME}:Generated Successfuly!`)
  },
})
