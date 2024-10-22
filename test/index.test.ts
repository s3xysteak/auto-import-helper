import { describe, expect, expectTypeOf, it } from 'vitest'
import { createImport, createResolver } from '../src'

describe('import', () => {
  const v = createImport('lodash', ['map', 'filter'] as const)

  it('type', () => {
    expectTypeOf(v).parameter(0).toEqualTypeOf<undefined | Partial<{ map: string, filter: string }>>()
    expectTypeOf(v).returns.toEqualTypeOf<Record<string, Array<string | [string, string]>>>()
  })

  it('base', () => {
    expect(v()).toEqual({ lodash: ['map', 'filter'] })
  })

  it('rename', () => {
    expect(v({ map: 'myMap' })).toEqual({ lodash: [['map', 'myMap'], 'filter'] })
  })
})
