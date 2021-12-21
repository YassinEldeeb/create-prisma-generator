import fs from 'fs'
import path from 'path'
import { Answers } from '../types/answers'

export const replacePlaceholders = (answers: Answers, pkgName: string) => {
  let filesContainingPkgName = [
    // If generator template is in the workspace
    './README.md',
    './packages/generator/package.json',
    './packages/generator/README.md',
    './packages/generator/src/constants.ts',
    './packages/usage/package.json',
    './packages/usage/prisma/schema.prisma',
    // If generator template is in the root
    './package.json',
    './README.md',
    './src/constants.ts',
  ]

  filesContainingPkgName.forEach((filePath) => {
    const fullPath = path.join(process.cwd(), pkgName, filePath)
    if (!fs.existsSync(fullPath)) {
      filesContainingPkgName = filesContainingPkgName.filter(
        (e) => e != fullPath,
      )
      return
    }

    const file = fs.readFileSync(fullPath, { encoding: 'utf-8' })
    fs.writeFileSync(
      fullPath,
      file.replace(/\$PACKAGE_NAME/g, pkgName.toLowerCase()),
    )
  })

  // Replace the dependencie placeholder with generator version
  const packageJSONPath = path.join(
    process.cwd(),
    pkgName,
    './packages/usage/package.json',
  )
  const packageJSONFileExists = fs.existsSync(packageJSONPath)
  if (packageJSONFileExists) {
    const packageJSONFile = fs.readFileSync(packageJSONPath, {
      encoding: 'utf-8',
    })
    const packageVersion =
      answers.packageManager === 'yarn' || answers.packageManager === 'npm'
        ? '1.0.0'
        : 'workspace:*'
    fs.writeFileSync(
      packageJSONPath,
      packageJSONFile.replace(/\$PACKAGE_VERSION/g, packageVersion),
    )
  }

  // Replace generator provider placeholder with actual provider
  const prismaSchemaPath = path.join(
    process.cwd(),
    pkgName,
    './packages/usage/prisma/schema.prisma',
  )
  const prismaSchemaFileExists = fs.existsSync(prismaSchemaPath)
  if (prismaSchemaFileExists) {
    const prismaSchemaFile = fs.readFileSync(prismaSchemaPath, {
      encoding: 'utf-8',
    })
    const prismaProvider =
      answers.packageManager === 'yarn' || answers.packageManager === 'npm'
        ? `node ../../node_modules/${pkgName}`
        : `npx ${pkgName}`

    fs.writeFileSync(
      prismaSchemaPath,
      prismaSchemaFile.replace(/\$CUSTOM_GENERATOR_PROVIDER/g, prismaProvider),
    )
  }
}
