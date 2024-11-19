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
export function createImport<T extends string[]>(packageName: string, exports: T) {
  return (map?: ImportParam<typeof exports[number]>): ImportReturns => {
    return {
      [packageName]: exports.map(v => map && (map as any)[v] ? [v, (map as any)[v]] : v),
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
export function createResolver<T extends string[]>(packageName: string, exports: T) {
  return (map?: ImportParam<typeof exports[number]>) =>
    (name: string) => {
      if (!exports.includes(name))
        return

      return {
        name,
        from: packageName,
        ...map && (map as any)[name] ? { as: (map as any)[name] } : {},
      }
    }
}
