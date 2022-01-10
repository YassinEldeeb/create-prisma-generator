import fs from 'fs'
import path from 'path'
import { logger } from './utils/logger'
import { spawn } from 'child_process'
import { kebabize } from './utils/kebabize'

const templateName = kebabize(process.argv[2] || '')

if (!templateName) {
  logger.error('Please Provide a name for the template')
  logger.info('Like this:')
  logger.info('pnpm new-template cpg-template-typescript')
} else {
  if (!templateName.startsWith('cpg-')) {
    logger.error('Template name must start with "cpg-"')
    logger.info('Like this:')
    logger.info('pnpm new-template cpg-template-typescript')
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
          path.join(__dirname, 'templates/addNewTemplate/sample.template.js'),
          'utf-8',
        ),
      )
      const binFile = `#!/usr/bin/env node
require('./index')()
`
      fs.writeFileSync(
        path.join(process.cwd(), 'packages', templateName, 'bin.js'),
        binFile,
      )
      fs.writeFileSync(
        path.join(process.cwd(), 'packages', templateName, '.npmignore'),
        fs.readFileSync(
          path.join(__dirname, 'templates/addNewTemplate/.npmignore'),
          'utf-8',
        ),
      )

      fs.writeFileSync(
        path.join(process.cwd(), 'packages', templateName, 'package.json'),
        fs
          .readFileSync(
            path.join(__dirname, 'templates/addNewTemplate/package.json'),
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
        console.log(`Start hacking ;)`)
      })
    }
  }
}
