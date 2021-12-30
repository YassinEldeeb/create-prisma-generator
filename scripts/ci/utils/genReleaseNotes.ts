export const generateReleaseNotes = (
  nextVersion: string,
  repoPublicUrl: string,
  nextTag: string,
  semanticChanges: any[],
  pkgName: string,
  lastTag?: string,
) => {
  const releaseHeader = lastTag
    ? `## ${pkgName}-v${nextVersion} 🥳`
    : `## ${pkgName} First Release 🎉`

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

  const releaseNotes =
    releaseHeader +
    '\n' +
    releaseDetails +
    '\n\n' +
    `[Compare changes with the previous release](${repoPublicUrl}/compare/${lastTag}...${nextTag})`

  return releaseNotes
}
