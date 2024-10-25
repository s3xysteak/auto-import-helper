export type ImportParam<T extends PropertyKey> = Partial<Record<T, string>>
export type ImportReturns = Record<string, Array<string | [string, string]>>

/**
 * ## example
 * ```js
 * // import.js
 * export default createImport('lodash', ['map', 'filter'])
 *
 * // user
 * import LodashImport from './import.js'
 * export default defineConfig({
 *   AutoImport({
 *     imports: [
 *       LodashImport()
 *     ]
 *   })
 * })
 * ```
 */
export function createImport<T extends string[]>(packageName: string, names: T) {
  return (map?: ImportParam<typeof names[number]>): ImportReturns => {
    return {
      [packageName]: names.map(v => map && (map as any)[v] ? [v, (map as any)[v]] : v),
    }
  }
}

/**
 * ## example
 * ```js
 * // resolver.js
 * export default createResolver('lodash', ['map', 'filter'])
 *
 * // user
 * import LodashResolver from './resolver.js'
 * export default defineConfig({
 *   AutoImport({
 *     resolvers: [
 *       LodashResolver()
 *     ]
 *   })
 * })
 * ```
 */
export function createResolver<T extends string[]>(packageName: string, names: T) {
  return (map?: ImportParam<typeof names[number]>) =>
    (name: string) => {
      if (!names.includes(name))
        return

      return {
        name,
        from: packageName,
        ...map && (map as any)[name] ? { as: (map as any)[name] } : {},
      }
    }
}

export type Awaitable<T> = T | PromiseLike<T>
export async function fromTransform(
  code: string,
  handler: () => Awaitable<string[]>,
  reg: RegExp = /\[\s*\/\*{1,2}\s*auto-import-helper\s*\*\/\s*\]/g,
) {
  return code.replace(reg, JSON.stringify(await handler()))
}

export function autoImportHelperPlugin(
  handler: Parameters<typeof fromTransform>[1],
  condition: (id: string) => boolean = id => /src[/|\\]import.[t|j]sx?$/.test(id),
) {
  return {
    name: 'auto-import-helper',
    transform(code: string, id: string) {
      return condition(id) ? fromTransform(code, handler) : undefined
    },
  }
}
