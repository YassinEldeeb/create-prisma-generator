export const generateReleaseNotes = (
  nextVersion: string,
  repoPublicUrl: string,
  nextTag: string,
  semanticChanges: any[],
  lastTag?: string,
) => {
  const releaseDiffRef = lastTag
    ? `## [${nextVersion}](${repoPublicUrl}/compare/${lastTag}...${nextTag}) (${new Date()
        .toISOString()
        .slice(0, 10)})`
    : '## Init'

  const releaseDetails = Object.values(
    semanticChanges.reduce((acc, { group, change, short, hash }) => {
      const { commits } = acc[group] || (acc[group] = { commits: [], group })
      const commitRef = `* ${change} ([${short}](${repoPublicUrl}/commit/${hash}))`

      commits.push(commitRef)

      return acc
    }, {}),
  )
    .map(({ group, commits }: any) => `### ${group}\n${commits.join('\n')}`)
    .join('\n')

  const releaseNotes = releaseDiffRef + '\n' + releaseDetails + '\n'

  return releaseNotes
}
