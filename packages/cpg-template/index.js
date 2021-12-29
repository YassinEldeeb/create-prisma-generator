#!/usr/bin/env node
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url))
fse.copySync(
  path.join(path.join(__dirname, `./template`)),
  path.join(process.cwd(), process.argv[2]),
)
