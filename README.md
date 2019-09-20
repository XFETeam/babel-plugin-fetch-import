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

## ChangeLog

## 0.0.2

* fix: 修复关于 module import 应该携带原 url 后缀, 这样便于其他 loader 进行进一步的解析的问题

## 0.0.1

* init commit

## 作者
She Ailun