export const getInstallCommand = (pkgManager: 'npm' | 'yarn' | 'pnpm') => {
  let installCommand: string
  switch (pkgManager) {
    case 'npm':
      installCommand = 'npm i'
      break
    case 'yarn':
      installCommand = 'yarn'
      break
    case 'pnpm':
      installCommand = 'pnpm i'
      break
  }

  return installCommand
}
