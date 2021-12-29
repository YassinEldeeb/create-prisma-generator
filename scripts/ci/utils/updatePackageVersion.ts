import { execSync } from 'child_process'

export const updatePackageVersion = (cwd: string, nextVersion: string) => {
  console.log(cwd)
  execSync(`npm --no-git-tag-version version ${nextVersion}`, {
    cwd,
  })
}
