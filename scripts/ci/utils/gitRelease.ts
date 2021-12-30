import { execSync } from 'child_process'

export const gitRelease = (nextTag: string) => {
  const releaseMessage = `chore(release): ${nextTag} [skip ci]`
  execSync(`git add -A .`)
  execSync(`git commit --no-verify -m"${releaseMessage}"`)
  execSync(`git tag -a ${nextTag} HEAD -m"${releaseMessage}"`)
  execSync(`git push --no-verify --follow-tags origin main`)
}
