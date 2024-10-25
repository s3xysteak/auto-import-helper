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

Use `transformFile` function to achieve automation:

```ts
// src/import.ts
import { createImport } from 'auto-import-helper'
import pkg from '../package.json'

/** auto-import-helper */
export default createImport(pkg.name, [] as const)
```

```js
// scripts/update-import.ts
import { transformFile } from 'auto-import-helper'

await transformFile(
  './src/import.ts',
  Object.keys(await import('./src/index.ts'))
)
```

Edit your script:

```json
{
  "scripts": {
    "build": "esno ./scripts/update-import.ts && unbuild"
  }
}
```

Refer to [Example](/test/pg)
