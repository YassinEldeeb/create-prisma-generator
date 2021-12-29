import { execSync } from 'child_process'

export const updatePackageVersion = (cwd: string, nextVersion: string) => {
  execSync(`npm --no-git-tag-version version ${nextVersion}`, {
    cwd,
  })
}
