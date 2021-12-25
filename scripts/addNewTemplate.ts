import fs from 'fs'
import path from 'path'
import { logger } from './utils/logger'
import { spawn } from 'child_process'

const kebabize = (str: string) =>
  str
    .trim()
    .replace(
      /[A-Z]+(?![a-z])|[A-Z]/g,
      ($, ofs) => (ofs ? '-' : '') + $.toLowerCase(),
    )

const templateName = kebabize(process.argv[2] || '')

if (!templateName) {
  logger.error('Please Provide a name for the template')
  logger.info('Like this:')
  logger.info('yarn new-template cpg-template-typescript')
} else {
  if (!templateName.startsWith('cpg-')) {
    logger.error('Template name must start with "cpg-"')
    logger.info('Like this:')
    logger.info('yarn new-template cpg-template-typescript')
  } else {
    const templatePath = path.join(process.cwd(), 'packages', templateName)
    if (fs.existsSync(templatePath)) {
      logger.error('Template already Exists!')
    } else {
      fs.mkdirSync(path.join(process.cwd(), 'packages', templateName))
      fs.mkdirSync(
        path.join(process.cwd(), 'packages', templateName, 'template'),
      )
      fs.writeFileSync(
        path.join(process.cwd(), 'packages', templateName, 'index.js'),
        fs.readFileSync(
          path.join(__dirname, 'helpers/addNewTemplate/sample.template.js'),
          'utf-8',
        ),
      )
      fs.writeFileSync(
        path.join(process.cwd(), 'packages', templateName, '.npmignore'),
        fs.readFileSync(
          path.join(__dirname, 'helpers/addNewTemplate/.npmignore'),
          'utf-8',
        ),
      )

      fs.writeFileSync(
        path.join(process.cwd(), 'packages', templateName, 'package.json'),
        fs
          .readFileSync(
            path.join(__dirname, 'helpers/addNewTemplate/package.json'),
            'utf-8',
          )
          .replace('$PKG_NAME', templateName.replace('cpg-', ''))
          .replace('$PKG_BIN', templateName),
      )

      spawn(`cd packages/${templateName} && pnpm i`, {
        shell: true,
        stdio: 'inherit',
      }).on('exit', () => {
        const cliUsagePkgJSONPath = path.join(
          process.cwd(),
          'packages/cli-usage',
          'package.json',
        )
        const cliUsagePkgJSON = JSON.parse(
          fs.readFileSync(cliUsagePkgJSONPath, 'utf-8'),
        )
        cliUsagePkgJSON.devDependencies[
          `@cpg-cli/${templateName.replace('cpg-', '')}`
        ] = 'workspace:*'
        fs.writeFileSync(
          cliUsagePkgJSONPath,
          JSON.stringify(cliUsagePkgJSON, null, 2),
        )

        logger.success(`Your template is ready at 'packages/${templateName}'`)
        console.log(`Start hacking`)
      })
    }
  }
}
