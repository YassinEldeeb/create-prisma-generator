export const genEnum = ({ name, values }) => {
  const enumValues = values.map(({ name }) => `${name}="${name}"`).join(',\n')

  return `enum ${name} { \n${enumValues}\n }`
}
