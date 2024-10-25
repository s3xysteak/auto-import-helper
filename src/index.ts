import type { PathLike } from 'node:fs'
import * as fs from 'node:fs/promises'

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

/**
 * Replace the first array after auto-import-helper comment by a target string
 * @param str A string which will be transformed
 * @param insert If array, stringify it by `JSON.stringify`
 *
 * ## example
 *
 * /&ast;&ast; auto-import-helper &ast;/
 *
 * const foo = []
 *
 * ```
 * transformString(aboveString, ['bar']) // ->
 * ```
 *
 * /&ast;&ast; auto-import-helper &ast;/
 *
 * const foo = ['bar']
 */
export function transformString(str: string, insert: string | string[]) {
  return str.replace(
    /(\/\*{1,2}\s*auto-import-helper\s*\*\/[^[]*)(\[.*?\])/s,
    (_, $1) => `${$1}${Array.isArray(insert) ? JSON.stringify(insert) : insert}`,
  )
}

/**
 * Make `transformString` work on a js file.
 *
 * ## example
 * ```js
 * await transformFile(
 *   './src/import.ts',
 *   Object.keys(await import('./src/index'))
 * )
 * ```
 */
export async function transformFile(path: PathLike | fs.FileHandle, exports: string[]) {
  const content = await fs.readFile(path, { encoding: 'utf-8' })
  await fs.writeFile(path, transformString(content, exports))
}
