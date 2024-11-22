import { expect, it } from 'vitest'

import { createImport, createResolver, createSearch } from '../src'

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

it('createSearch', () => {
  const search = createSearch('createImport')

  expect(search('createImport')).toBeNull()
  expect(search('createImport createImport')).toBeNull()
  expect(search('createImport createImport()')).toBeNull()

  expect(search(`createImport(name, [])`)).toEqual([19, 21])
  expect(search(`createImport(name, ['foo'])`)).toEqual([19, 26])
  expect(search(`createImport('abc', ['foo'])`)).toEqual([20, 27])
  expect(search(`createImport createImport(name, [])`)).toEqual([32, 34])
  expect(search(`createImport createImport(name, ['foo'])`)).toEqual([32, 39])

  expect(search(`createImport('name', [])`)).toEqual([21, 23])
  expect(search(`createImport('name', ['foo'])`)).toEqual([21, 28])
  expect(search(`createImport('name', ['f,[(])oo'])`)).toEqual([21, 33])
})

it('fixture', () => {
  const search = createSearch('createImport')

  expect(search(`
import { createImport } from 'auto-import-helper'
export default createImport('name', [] as const)
`)).toEqual([87, 89])
  expect(search(`
import { createImport } from 'auto-import-helper'
import pkg from '../package.json'

export default createImport(pkg.name, [] as const)
`)).toEqual([124, 126])
  expect(search(`
import { createImport } from 'auto-import-helper'
import pkg from '../package.json'

export default createImport(pkg.name, ['foo', 'bar'] as const)
`)).toEqual([124, 138])
})
