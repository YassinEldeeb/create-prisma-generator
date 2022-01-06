import { flags } from '../flags'

export const filterValue = (value: any) => {
  if (typeof value !== 'string') {
    return value
  }

  let filteredPkgName = value

  Object.keys(flags).forEach((flag) => {
    filteredPkgName = filteredPkgName
      .replace(flags[flag as keyof typeof flags], '')
      .trim()
  })

  return filteredPkgName
}
