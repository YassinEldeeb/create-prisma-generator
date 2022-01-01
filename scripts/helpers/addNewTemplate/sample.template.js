#!/usr/bin/env node
const path = 'path'
const fs = 'fs'

fse.copySync(
  path.join(__dirname, `./template`),
  path.join(process.cwd(), process.argv[2]),
)
