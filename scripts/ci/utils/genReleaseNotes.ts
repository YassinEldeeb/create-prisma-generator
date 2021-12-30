import { logger } from '../../utils/logger'

export const generateReleaseNotes = (
  nextVersion: string,
  repoPublicUrl: string,
  nextTag: string,
  semanticChanges: any[],
  pkgName: string,
  lastTag?: string,
) => {
  const prettierPkgName = pkgName
    .replace('@cpg-cli/', '')
    .split('-')
    .map((e) => e[0].toUpperCase() + e.substring(1))
    .join(' ')

  const releaseHeader = lastTag
    ? `## ${prettierPkgName} v${nextVersion} 🥳`
    : `## ${prettierPkgName} First Release 🎉`

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
    `[Compare changes](${repoPublicUrl}/compare/${lastTag}...${nextTag})`

  logger.success('\nRelease notes generated successfully!\n')

  return releaseNotes
}
