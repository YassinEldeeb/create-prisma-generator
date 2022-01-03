import { execSync } from 'child_process'
import path from 'path'

// TODO: Must ignore files in __tests__ when deciding
export const hasPkgChanged = (folder: string) => {
  console.log(execSync(`git diff HEAD^ HEAD --name-only`).toString())
  return !!execSync(`git diff HEAD^ HEAD --name-only`)
    .toString()
    .trim()
    .split('\n')
    .find((e) => e.includes(folder))
}

console.log(hasPkgChanged('./packages/cpg-github-actions'))
