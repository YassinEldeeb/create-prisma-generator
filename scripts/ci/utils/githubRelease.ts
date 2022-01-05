import { logger } from '../../utils/logger'
import axios from 'axios'

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

  // API Ref: https://docs.github.com/en/rest/reference/releases#create-a-release
  axios.post(`https://api.github.com/repos/${repoName}/releases`, releaseData, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
  })

  logger.success(`Published a new release with tag ${tag}!`)
}
