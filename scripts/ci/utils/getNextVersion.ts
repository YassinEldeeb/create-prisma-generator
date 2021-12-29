export const getNextVersion = (
  nextReleaseType: string,
  lastTag: string,
  releasePrefix: string,
) => {
  if (!nextReleaseType) {
    return
  }
  if (!lastTag) {
    return '1.0.0'
  }

  const [c1, c2, c3] = lastTag.split(releasePrefix)[1].split('.')
  if (nextReleaseType === 'major') {
    return `${-~c1}.0.0`
  }
  if (nextReleaseType === 'minor') {
    return `${c1}.${-~c2}.0`
  }
  if (nextReleaseType === 'patch') {
    return `${c1}.${c2}.${-~c3}`
  }
}
