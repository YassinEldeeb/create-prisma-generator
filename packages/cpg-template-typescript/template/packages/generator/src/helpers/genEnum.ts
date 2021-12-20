import { DMMF } from '@prisma/generator-helper'

export const genEnum = ({ name, values }: DMMF.DatamodelEnum) => {
  const enumValues = values.map(({ name }) => `${name}="${name}"`).join(',\n')

  return `enum ${name} { \n${enumValues}\n }`
}
