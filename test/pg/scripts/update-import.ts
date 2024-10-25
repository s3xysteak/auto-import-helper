import { execSync } from 'node:child_process'
import { transformFile } from 'auto-import-helper'

await transformFile(
  new URL('../src/import.ts', import.meta.url),
  Object.keys(await import('../src')),
)

// just fix your style!
execSync('eslint . --fix src/import.ts')
