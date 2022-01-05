import { generatorHandler } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import path from 'path'
import { GENERATOR_NAME } from './constants'
import { genEnum } from './helpers/genEnum'
import { writeFileSafely } from './utils/writeFileSafely'

logger.info(`${GENERATOR_NAME}:Registered`)

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`)
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: async (options) => {
    options.dmmf.datamodel.enums.forEach(async (enumInfo) => {
      const tsEnum = genEnum(enumInfo)

      const writeLocation = path.join(
        options.generator.output?.value,
        `${enumInfo.name}.ts`,
      )

      await writeFileSafely(writeLocation, tsEnum)
    })
  },
})
