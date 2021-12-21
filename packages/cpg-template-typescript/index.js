#!/usr/bin/env node
import { copyTemplate } from '@cpg-cli/common'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
copyTemplate(path.join(__dirname, `./template`), process.argv[2])
