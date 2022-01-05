import { DMMF } from '@prisma/generator-helper'
import { genEnum } from '../helpers/genEnum'
import { getSampleDMMF } from './__fixtures__/getSampleDMMF'

let sampleDMMF: DMMF.Document
beforeAll(async () => {
  sampleDMMF = await getSampleDMMF()
})

test('enum generation', () => {
  sampleDMMF.datamodel.enums.forEach((enumInfo) => {
    expect(genEnum(enumInfo)).toMatchSnapshot(enumInfo.name)
  })
})
