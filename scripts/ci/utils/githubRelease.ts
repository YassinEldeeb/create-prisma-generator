import { execSync } from 'child_process'
import { logger } from '../../utils/logger'

export const githubRelease = (
  tag: string,
  releaseNotes: string,
  repoName: string,
  GIT_COMMITTER_NAME: string,
  GITHUB_TOKEN: string,
) => {
  const releaseData = JSON.stringify({
    name: tag,
    tag_name: tag,
    body: releaseNotes,
    owner: GIT_COMMITTER_NAME,
  })

  // TODO: Fix "/bin/sh: 1: Syntax error: "(" unexpected"
  // API Ref: https://docs.github.com/en/rest/reference/releases#create-a-release
  console.log(
    `curl -X POST -u ${GIT_COMMITTER_NAME}:${GITHUB_TOKEN} -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/${repoName}/releases -d '${releaseData}'`,
  )
  const data = execSync(
    `curl -X POST -u ${GIT_COMMITTER_NAME}:${GITHUB_TOKEN} -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/${repoName}/releases -d '${releaseData}'`,
  )
  console.log(data.toString)

  logger.success(`Published a new release with tag ${tag}!`)
}
