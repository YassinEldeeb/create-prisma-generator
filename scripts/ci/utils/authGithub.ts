import { execSync } from 'child_process'

export const AuthGithub = () => {
  const { GIT_COMMITTER_NAME, GIT_COMMITTER_EMAIL, GITHUB_TOKEN } = process.env
  const gitAuth = `${GIT_COMMITTER_NAME}:${GITHUB_TOKEN}`
  const originUrl = execSync(`git config --get remote.origin.url`)
    .toString()
    .trim()

  const [_, __, repoHost, repoName] = originUrl
    .replace(':', '/')
    .replace(/\.git/, '')
    .match(/.+(@|\/\/)([^/]+)\/(.+)$/) as RegExpMatchArray

  const repoPublicUrl = `https://${repoHost}/${repoName}`
  const repoAuthedUrl = `https://${gitAuth}@${repoHost}/${repoName}`

  execSync(`git config user.name ${GIT_COMMITTER_NAME}`)
  execSync(`git config user.email ${GIT_COMMITTER_EMAIL}`)
  execSync(`git remote set-url origin ${repoAuthedUrl}`)

  return { repoPublicUrl, repoName }
}
