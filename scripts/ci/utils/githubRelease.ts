import { execSync } from 'child_process'

export const githubRelease = (
  nextTag: string,
  releaseNotes: string,
  repoName: string,
  GIT_COMMITTER_NAME: string,
  GITHUB_TOKEN: string,
) => {
  const releaseData = JSON.stringify({
    name: nextTag,
    tag_name: nextTag,
    body: releaseNotes,
  })

  console.log(
    execSync(
      `curl -u ${GIT_COMMITTER_NAME}:${GITHUB_TOKEN} -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/${repoName}/releases -d '${releaseData}'`,
    ).toString(),
  )
}
