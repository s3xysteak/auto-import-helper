export type ImportParam<T extends PropertyKey> = Partial<{ [K in T]: string }>
export type ImportReturns = Record<string, Array<string | [string, string]>>

export function createImport<T extends string[]>(packageName: string, names: T) {
  return (map?: ImportParam<typeof names[number]>): ImportReturns => {
    return {
      [packageName]: names.map(v => map && (map as any)[v] ? [v, (map as any)[v]] : v),
    }
  }
}

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
