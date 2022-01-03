export const hasPkgChanged = (changes: string[], folder: string) => {
  const ignore = ['__tests__']

  return !!changes.find(
    (e) =>
      ignore.findIndex((item) => e.includes(item)) === -1 && e.includes(folder),
  )
}
