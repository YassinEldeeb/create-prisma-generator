import { genEnum } from '../helpers/genEnum'
import { sampleDMMF } from './__helpers__/sampleDMMF'

sampleDMMF.forEach((enumInfo) => {
  test(`enum generation | ${enumInfo.name}`, () => {
    expect(genEnum(enumInfo)).toMatchSnapshot()
  })
})
