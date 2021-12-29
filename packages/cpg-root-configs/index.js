#!/usr/bin/env node
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url))

fse.copySync(
  path.join(__dirname, `./template`),
  path.join(process.cwd(), process.argv[2]),
)

fse.renameSync(
  path.join(process.cwd(), process.argv[2], 'gitIgnoreConf.txt'),
  path.join(process.cwd(), process.argv[2], '.gitignore'),
)
