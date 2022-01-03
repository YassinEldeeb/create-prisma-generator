import { execSync } from 'child_process'

// TODO: Must ignore files in __tests__ when deciding
export const hasPkgChanged = (folder: string) => {
  const ignore = ['__tests__']
  return !!execSync(`git diff HEAD^ HEAD --name-only`)
    .toString()
    .trim()
    .split('\n')
    .find(
      (e) =>
        ignore.findIndex((item) => e.includes(item)) === -1 &&
        e.includes(folder),
    )
}
