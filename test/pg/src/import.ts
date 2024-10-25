import { createImport } from 'auto-import-helper'
import pkg from '../package.json'

/** auto-import-helper */
export default createImport(pkg.name, ['getTwo', 'one'] as const)
