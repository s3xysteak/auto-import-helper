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
