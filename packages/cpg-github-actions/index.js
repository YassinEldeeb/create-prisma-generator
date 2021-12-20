#!/usr/bin/env node
import { copyTemplate } from '@cpg/common'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
copyTemplate(
  path.join(__dirname, `./template/.github`),
  `${process.argv[2]}/.github`,
)
