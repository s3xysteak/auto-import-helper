# auto-import-helper

简洁、无依赖、超迷你！

助你开箱即用支持 [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) ！

## 使用

### 基本使用

在你的库中：

```ts
// my-lib
import { createImport, createResolver } from 'auto-import-helper'

// 使用 `as const` 是为了获得更好的类型提示
export const I = createImport('lodash', ['filter'] as const)
export const R = createResolver('nuxt-ui', ['Button'] as const)
```

用户：

```js
import { I, R } from 'my-lib'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        // 默认
        I(),
        // 重命名
        I({
          filter: 'myFilter'
        })
      ],
      resolvers: [
        // 不推荐在auto-import中使用resolver，但你可以这么做
        R()
      ]
    }),
    Components({
      resolvers: [
        // 默认
        R(),
        // 重命名
        R({
          Button: 'NButton'
        })
      ]
    })
  ]
})
```

### 自动化

使用 `transformFile` 方法实现自动化:

```ts
// src/import.ts
import { createImport } from 'auto-import-helper'
import pkg from '../package.json'

/** auto-import-helper */
export default createImport(pkg.json, [] as const)
```

```js
// scripts/update-import.ts
import { transformFile } from 'auto-import-helper'

await transformFile(
  './src/import.ts',
  Object.keys(await import('./src/index.ts'))
)
```

修改你的脚本：

```json
{
  "scripts": {
    "build": "esno ./scripts/update-import.ts && unbuild"
  }
}
```

[示例](/test/pg)
