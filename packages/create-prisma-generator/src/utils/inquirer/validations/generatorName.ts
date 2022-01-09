import validatePkgName from 'validate-npm-package-name'
import chalk from 'chalk'
import { flags } from '../flags'

export const validateGeneratorName = (pkgName: string) => {
  const validPkgName = validatePkgName(
    pkgName.replace(flags.skipPrismaNamingConventionFlag, '').trim(),
  )

  if (!validPkgName.validForNewPackages) {
    console.log(chalk.red(`\n"${pkgName}" isn't a valid package name!`))
    validPkgName.errors?.forEach((e) => console.log(chalk.cyan(e)))
    validPkgName.warnings?.forEach((e) => console.log(chalk.yellow(e)))
    return false
  } else {
    const sanitizedPkgName = pkgName.trim()
    const namingConvention = 'prisma-generator-'
    const org = sanitizedPkgName.startsWith('@')
      ? sanitizedPkgName.split('/')[0]
      : null
    const skipCheck =
      sanitizedPkgName.trim().split(' ')[1] ===
      flags.skipPrismaNamingConventionFlag

    if (!skipCheck) {
      if (
        // This should be `.includes` and not `.startsWith`
        // to allow for scoped packages like @org/..
        !sanitizedPkgName.includes(namingConvention) ||
        // Add 1 to ensure he typed something after the naming convention
        sanitizedPkgName.length < namingConvention.length + 1
      ) {
        if (org) {
          console.log(
            chalk.cyan(
              `\nPrisma recommends you to use this naming convention:\n`,
            ),
            chalk.yellow(`${org}/${namingConvention}<custom-name>\n`),
          )
        } else {
          console.log(
            chalk.cyan(
              `\n\nPrisma recommends you to use this naming convention:\n`,
            ),
            chalk.yellow(`${namingConvention}<custom-name>`),
          )
        }
        console.log(
          chalk.grey(
            `use the \`${flags.skipPrismaNamingConventionFlag}\` flag to skip prisma's recommendation.\n`,
          ),
        )
        return false
      }
    }

    return true
  }
}
