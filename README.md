# @xfe-team/babel-plugin-fetch-import

> 当前插件主要用于让 import 支持 http 引入形式, 就像 [Deno](https://deno.land/manual.html#goals) 一样

## 安装

```bash
  npm install @xfe-team/babel-plugin-fetch-import --save-dev
```

```bash
  yarn add @xfe-team/babel-plugin-fetch-import --dev
```

## 配置
```javascript
module.exports = {
    entry: {
        // ...
    },
    output: {
        // ...
    },
    module: {
        rules: [{
            test: /\.js|jsx$/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: [
                         // FBI WARNING: 请确保当前插件在 import 被"编译"前处理
                        '@xfe-team/babel-plugin-fetch-import'
                    ]
                }
            }
        }]
    },
    // ...
}
```

## 使用

#### 仅使用字符串的形式拉取:

```bash
  import zepto from 'FETCH:https://cdn.bootcss.com/zepto/1.0rc1/zepto.min.js';
  
  console.log(zepto);
  // 此时返回 zepto 字符串内容
```

#### 作为 commonjs 模块拉取:

```bash
  import React from 'MODULE:https://unpkg.com/react@16.9.0/umd/react.development.js';
  
  console.log(React);
  // 此时返回 metaFlexible export 的对象
```

## 缓存

处于性能考虑, 默认情况下对于绝对路径如 `https://unpkg.com/react@16.9.0/umd/react.development.js` 会优先检查是否已经缓存,
无缓存时发起 http 请求拉去地址内容并缓存起来. 这样的策略是为了防止每一次编译导致都需要阻塞的拉去若干请求, 导致编译过慢.

由于这个缓存策略, 当前 `plugin` 也期望请求地址为<b>静态</b>不变的 url 地址, 如果远程请求地址发生变更, 请自行加入参数让当前 `plugin` 的缓存失效,
如: `https://unpkg.com/react@16.9.0/umd/react.development.js?ts=123`

当前缓存均保存在 `${cwd}/node_modules/.cache/@xfe-team/babel-plugin-fetch-import/` 下.

## 灵感

当前插件主要来源于: 
[babel-plugin-import-customized-require](https://github.com/alienzhou/babel-plugin-import-customized-require) <br />
[Deno](https://github.com/denoland/deno)

## 功能补全

1. 在 `0.0.3` 版本中加入了 `__extension`, 但仍存在用户可能<b>冲突的</b>使用到了这个 query string 参数. 后续应提供可更改 `__extension` 的配置项
2. 在 `0.0.3` 版本中加入了 `__extension`, 当前库可以根据返回的 mine-type 自动识别正确的后缀, 尽管这个匹配率不一定会非常高.

## ChangeLog

## 0.0.4

* feat: 修复 import png 等非文本类型文件出错的问题

## 0.0.3

* feat: 针对部分链接存在不存在后缀的, 如 `'https://github.com/happy'`, 使用者可以在使用 `__extension=js` 来指引当前链接应该使用什么后缀, 如: `'https://github.com/happy?__extension=js'`. 
这将直接影响 module import 时应该用什么 `loader 进行当前 `url` 解析.

## 0.0.2

* fix: 修复关于 `module import` 应该携带原 `url` 后缀, 这样便于其他 `loader` 进行进一步的解析的问题

## 0.0.1

* init commit

## 作者
She Ailun