import { execSync } from 'child_process'

// TODO: Must ignore files in __tests__ when deciding
export const hasPkgChanged = (folder: string) => {
  return !!execSync(`git diff ^HEAD HEAD --name-only`)
    .toString()
    .trim()
    .split('\n')
    .find((e) => e.includes(folder))
}
