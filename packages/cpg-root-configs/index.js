#!/usr/bin/env node
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url))

const gitIgnoreExists = fse.existsSync(
  path.join(__dirname, './template/gitIgnoreConf.txt'),
)
if (gitIgnoreExists) {
  fse.renameSync(
    path.join(__dirname, './template/gitIgnoreConf.txt'),
    path.join(__dirname, './template/.gitignore'),
  )
}

fse.copySync(
  path.join(__dirname, `./template`),
  path.join(process.cwd(), process.argv[2]),
)
