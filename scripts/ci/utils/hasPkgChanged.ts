import { execSync } from 'child_process'

export const hasPkgChanged = (folder: string) => {
  console.log(
    execSync(`git diff HEAD^ HEAD --name-only`)
      .toString()
      .trim()
      .split('\n')
      .find((e) => e.includes(folder)),
  )
  console.log(folder)
  return !!execSync(`git diff HEAD^ HEAD --name-only`)
    .toString()
    .trim()
    .split('\n')
    .find((e) => e.includes(folder))
}
