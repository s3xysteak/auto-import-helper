import * as fs from 'node:fs/promises'
import { expect, it } from 'vitest'

import { createImport, createResolver, transformFile, transformString } from '../src'
import * as labTs from './lab/lab-ts'

it('import', () => {
  const v = createImport('lodash', ['map', 'filter'] as const)

  expect(v()).toEqual({ lodash: ['map', 'filter'] })
  expect(v({ map: 'myMap' })).toEqual({ lodash: [['map', 'myMap'], 'filter'] })
})

it('resolver', () => {
  const v = createResolver('lodash', ['map', 'filter'] as const)
  const fn = v({ map: 'myMap' })

  expect(fn('a')).toBeUndefined()
  expect(fn('map')).toEqual({ name: 'map', as: 'myMap', from: 'lodash' })
  expect(fn('filter')).toEqual({ name: 'filter', from: 'lodash' })
})

it('module', () => {
  const v = createImport('lab-ts', Object.keys(labTs))
  expect(v()).toEqual({ 'lab-ts': ['oneType', 'getTwoType'] })
})

it('transformString', () => {
  const content = `
/** auto-import-helper */
const foo = []
`
  expect(transformString(content, ['bar'])).toMatchSnapshot()
})

it('transformFile', async () => {
  const path = new URL('./lab/import.ts', import.meta.url)
  const init = () => fs.writeFile(path, `import { createImport } from '../../src'

/** auto-import-helper */
export default createImport('name', [])
`)
  // init
  await init()

  await transformFile(path, Object.keys(await import(new URL('./lab/lab-ts.ts', import.meta.url).href)))
  expect(await fs.readFile(path, 'utf-8')).toMatchSnapshot()

  await init()
})
