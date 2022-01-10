export const transformScopedName = (pkgName: string) => {
  return pkgName.startsWith('@')
    ? pkgName.replace('@', '').replace('/', '-')
    : pkgName
}
