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
 * Helper to search array index for code.
 * ## example
 *
 * Assume the code is:
 *
 * ```js
 * import { createImport } from 'auto-import-helper'
 * export default createImport('name', [] as const)
 * ```
 *
 * ```js
 * const search = createSearch('createImport')
 * const [start, end] = search(codeString) // index of [ and ]
 * await fs.writeFile('path', codeString.slice(0, start) + JSON.stringify(['foo']) + codeString.slice(end) )
 * ```
 */
export function createSearch(prefix: 'createImport' | 'createResolver' | string & {}) {
  return (str: string) => {
    const startIndex = str.indexOf(`${prefix}(`)
    if (startIndex < 0)
      return null

    let bracketCount = 0
    let commaIndex = startIndex + prefix.length + 1

    while (commaIndex < str.length) {
      if (str[commaIndex] === ',' && bracketCount === 0)
        break

      if (str[commaIndex] === '(') {
        bracketCount++
      }
      else if (str[commaIndex] === ')') {
        bracketCount--
        if (bracketCount < 0)
          return null
      }

      commaIndex++
    }

    if (commaIndex >= str.length)
      return null

    const arrStart = str.indexOf('[', commaIndex)
    if (arrStart < 0)
      return null

    let squareBracketCount = 0
    let arrEnd = arrStart + 1

    while (arrEnd < str.length) {
      if (str[arrEnd] === ']' && squareBracketCount === 0)
        break

      if (str[arrEnd] === '[') {
        squareBracketCount++
      }
      else if (str[arrEnd] === ']') {
        squareBracketCount--
        if (squareBracketCount < 0)
          return null
      }

      arrEnd++
    }

    if (arrEnd >= str.length)
      return null

    return [arrStart, arrEnd + 1]
  }
}
