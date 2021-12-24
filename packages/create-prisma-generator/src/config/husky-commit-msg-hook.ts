// Husky adds hooks the same way for every machine
// so It's not a problem including a snapshot
// of the generated hook
// source: https://github.com/typicode/husky/blob/68b410341c3e2de320a16541d18ca80f07faa0d5/src/index.ts#L56-L70
export const huskyCommitMsgHook = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
`
