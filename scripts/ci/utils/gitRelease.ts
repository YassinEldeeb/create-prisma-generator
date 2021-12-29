import { execSync } from 'child_process'

export const gitRelease = (nextTag: string) => {
  const releaseMessage = `chore(release): ${nextTag} [skip ci]`
  execSync(`git add -A .`)
  console.log('RAAN hhoho0', releaseMessage)
  execSync(`git commit -m"${releaseMessage}"`)
  console.log('RAAN hhoho1')
  execSync(`git tag -a ${nextTag} HEAD -m ${releaseMessage}`)
  console.log('RAAN hhoho2')
  execSync(`git push --follow-tags origin HEAD:refs/heads/main`)
}
