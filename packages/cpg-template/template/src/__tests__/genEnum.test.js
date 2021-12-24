import { genEnum } from '../helpers/genEnum'
import { getSampleDMMF } from './__fixures__/writeSampleDMMF'

let sampleDMMF
beforeAll(async () => {
  sampleDMMF = await getSampleDMMF()
})

test('enum generation', () => {
  sampleDMMF.datamodel.enums.forEach((enumInfo) => {
    expect(genEnum(enumInfo)).toMatchSnapshot(enumInfo.name)
  })
})
