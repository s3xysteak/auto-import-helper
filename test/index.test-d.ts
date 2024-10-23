import { expectTypeOf, it } from 'vitest'
import { createImport, createResolver } from '../src'

type Awaitable<T> = T | PromiseLike<T>
interface ResolverResult {
  as?: string
  name?: string
  from: string
}

it('import', () => {
  const v = createImport('lodash', ['map', 'filter'] as const)

  expectTypeOf(v).parameter(0).toEqualTypeOf<undefined | Partial<{ map: string, filter: string }>>()
  expectTypeOf(v).returns.toEqualTypeOf<Record<string, Array<string | [string, string]>>>()
})

it('resolver', () => {
  const v = createResolver('lodash', ['map', 'filter'] as const)

  expectTypeOf(v).parameter(0).toEqualTypeOf<undefined | Partial<{ map: string, filter: string }>>()
  expectTypeOf(v).returns.toMatchTypeOf<(name: string) => Awaitable<string | ResolverResult | null | undefined | void>>()
})
