export const getPkgManagerLockFile = (
  pkgManager: 'npm' | 'yarn' | 'pnpm',
): string => {
  let pkgManagerLockFile

  switch (pkgManager) {
    case 'npm':
      pkgManagerLockFile = 'package-lock.json'
      break
    case 'yarn':
      pkgManagerLockFile = 'yarn.lock'
      break
    case 'pnpm':
      pkgManagerLockFile = 'pnpm-lock.yaml'
      break
  }

  return pkgManagerLockFile
}
