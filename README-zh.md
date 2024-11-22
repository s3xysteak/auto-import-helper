# auto-import-helper

[English](/README.md) | 简体中文

简洁、无依赖、超迷你！

助你开箱即用支持 [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)/[unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) ！

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

使用内置的 `createSearch` 函数:

```js
import { createSearch } from 'auto-import-help'

const search = createSearch('createImport')
search(`
import { createImport } from 'auto-import-helper'
export default createImport('name', [] as const)
`) // -> [87, 89]
```

`search`的返回值为`[`和`]`的索引，你可以像这样使用它:

```js
const code = await fs.readFile('path', 'utf-8')

const search = createSearch('createImport')
const [start, end] = search(code)

await fs.writeFile('path', code.slice(0, start) + JSON.stringify(['foo']) + code.slice(end))
```
