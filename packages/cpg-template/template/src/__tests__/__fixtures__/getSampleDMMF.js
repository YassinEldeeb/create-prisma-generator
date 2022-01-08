import { getDMMF, getSchemaSync } from '@prisma/sdk'
import path from 'path'

const samplePrismaSchema = getSchemaSync(path.join(__dirname, './sample.prisma'))

export const getSampleDMMF = async () => {
  return getDMMF({
    datamodel: samplePrismaSchema,
  })
}
