import { execSync } from 'child_process'

export const hasPkgChanged = (changes: string[], folder: string) => {
  const ignore = ['__tests__']

  const lastCommitMessage = execSync('git show -s --format=%s').toString()

  if (
    lastCommitMessage.includes('[force publish]') ||
    lastCommitMessage.includes('[force-publish]')
  ) {
    return true
  }
  return !!changes.find(
    (e) =>
      ignore.findIndex((item) => e.includes(item)) === -1 && e.includes(folder),
  )
}
