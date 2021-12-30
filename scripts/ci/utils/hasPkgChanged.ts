import { execSync } from 'child_process'

export const hasPkgChanged = (folder: string) => {
  return !!execSync(`git diff HEAD^ HEAD --name-only`)
    .toString()
    .trim()
    .split('\n')
    .find((e) => e.includes(folder))
}
