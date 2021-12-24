import { getDMMF } from '@prisma/sdk'
import fs from 'fs'
import path from 'path'

const samplePrismaSchema = fs.readFileSync(
  path.join(__dirname, './sample.prisma'),
  'utf-8',
)

export const getSampleDMMF = async () => {
  return getDMMF({
    datamodel: samplePrismaSchema,
  })
}
