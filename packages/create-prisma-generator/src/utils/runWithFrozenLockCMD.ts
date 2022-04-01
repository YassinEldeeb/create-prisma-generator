export const getRunWithFrozenLockCMD = (
  pkgManager: 'npm' | 'yarn' | 'pnpm',
): string => {
  let installWithFronzenLockCMD

  switch (pkgManager) {
    case 'npm':
      installWithFronzenLockCMD = 'npm ci'
      break
    case 'yarn':
      installWithFronzenLockCMD = 'yarn install --frozen-lockfile'
      break
    case 'pnpm':
      installWithFronzenLockCMD = 'pnpm i --frozen-lockfile'
      break
  }

  return installWithFronzenLockCMD
}
