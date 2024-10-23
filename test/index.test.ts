import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'

import { createImport, createResolver, fromTransform } from '../src'
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

it('fromTransform', async () => {
  const val = await fromTransform(
    `createImport('hello-world', [/** auto-import-helper */] as const)`,
    async () => {
      const val = await Promise.all([
        import('./lab/lab-ts'),
        import('./lab/lab-js.js' as any),
      ])
      return val.map(m => Object.keys(m)).reduce((acc, val) => [...acc, ...val], [])
    },
  )
  expect(
    `import { createImport } from '../../src'

${val}`,
  ).toMatchFileSnapshot(r('./__snapshots__/fromTransform.ts'))
})

function r(path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}
