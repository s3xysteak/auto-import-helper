import { expect, it } from 'vitest'

import { createImport, createResolver } from '../src'

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
