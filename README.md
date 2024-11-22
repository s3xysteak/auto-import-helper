# auto-import-helper

English | [简体中文](/README-zh.md)

Concise, zero dependency, super mini!

Help you support [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)/[unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) out-of-the-box!

## Usage

### Basic usage

In your lib:

```ts
// my-lib
import { createImport, createResolver } from 'auto-import-helper'

// use `as const` for better type hinting
export const I = createImport('lodash', ['filter'] as const)
export const R = createResolver('nuxt-ui', ['Button'] as const)
```

User:

```js
import { I, R } from 'my-lib'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        // default
        I(),
        // rename
        I({
          filter: 'myFilter'
        })
      ],
      resolvers: [
        // Not recommended to use resolver in auto-import, but you can do that
        R()
      ]
    }),
    Components({
      resolvers: [
        // default
        R(),
        // rename
        R({
          Button: 'NButton'
        })
      ]
    })
  ]
})
```

### Automation

Using the built-in `createSearch` function:

```js
import { createSearch } from 'auto-import-help'

const search = createSearch('createImport')
search(`
import { createImport } from 'auto-import-helper'
export default createImport('name', [] as const)
`) // -> [87, 89]
```

The returns of `search` is the indexes of `[` and `]`, you can use it like:

```js
const code = await fs.readFile('path', 'utf-8')

const search = createSearch('createImport')
const [start, end] = search(code)

await fs.writeFile('path', code.slice(0, start) + JSON.stringify(['foo']) + code.slice(end))
```
