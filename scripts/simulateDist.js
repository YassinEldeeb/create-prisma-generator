const fs = require('fs')
const path = require('path')

const cliPath = path.join(__dirname, '../packages/create-prisma-generator')
fs.mkdirSync(path.join(cliPath, 'dist'))
fs.writeFileSync(path.join(cliPath, 'dist/bin.js'), '')
