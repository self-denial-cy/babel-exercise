# @babel/polyfill

通过 @babel/polyfill 直接往全局对象上添加 API 以及直接往内置对象的 prototype 上添加方法实现 polyfill

这种方法本质上是往全局对象/内置对象原型上挂载属性，难免会造成全局污染（适用于开发应用，但不适用于开发库）

## 配置使用

@babel/polyfill 一般配合 @babel/preset-env 使用，前者提供 polyfill，后者提供高级语法转译

@babel/preset-env 存在一个参数 useBuiltIns，该参数决定了 polyfill 的方式

### useBuiltIns: false

这种情况下，@babel/preset-env 只会转译高级语法，并不会提供 polyfill

### useBuiltIns: entry

这种情况下，需要在项目入口文件中手动引入 @babel/polyfill，它会根据配置的浏览器兼容性列表全局引入不兼容的 polyfill

> 在 Babel 7.4.0 之后，@babel/polyfill 被废弃，因为它内部依赖项指定了 core-js 2.0 版本，随着 core-js 3.0 版本的推出，2.0 版本已不再维护，core-js 官方也更推荐使用 3.0 版本
>
> Babel 7.4.0 之后，Babel 官方将 core-js 版本的选择权交还用户，用户可以自己决定使用 2.0 or 3.0 版本，为此 @babel/preset-env 新增一个参数 corejs，该参数应与用户安装的 core-js 版本一致，该参数决定了 @babel/preset-env 如何使用 core-js，因为 core-js 2.0 与 3.0 的目录结构不一致，所以这个参数务必指定正确
>
> 除了需要手动引入 core-js 之外，还需要手动引入 regenerator-runtime，查看 @babel/polyfill 的 package.json 会发现 @babel/polyfill 的运行时依赖就是这两个包
>
> regenerator-runtime 的作用：项目中使用到 Generator 或 async 语法，经由 Babel 转译后的代码需要基于一个全局变量 regeneratorRuntime 才能正确运行，这个包就是提供这个变量的
>
> [在 Babel 7.18.0 之后，就不再需要手动引入这个包了，因为 Babel 将其内置了](https://developer.aliyun.com/article/982111)

Babel 7.4.0 之后，在使用 useBuiltIns 为 entry 或 usage 时，都需要指定下 corejs 参数，否则 Babel 不确定如何使用 core-js（默认按 2.0 版本使用）

### useBuiltIns: usage

当配置为 entry 时，@babel/preset-env 会基于浏览器兼容性列表进行全量 polyfill

所谓的全量 polyfill：代码中仅仅使用了 Array.from，但是 polyfill 并不仅仅只会引入 Array.from，只要是基于浏览器兼容性列表查到的可能不支持的特性，就算项目中未使用到，也会被 polyfill 进来，这就会造成包中 polyfill 的体积太大了

但是，当配置为 usage 时，@babel/preset-env 会基于浏览器兼容性列表和代码中使用到的特性进行按需 polyfill

同时，不需要额外在项目入口文件中引入 @babel/polyfill 了，它会根据代码中使用到的地方进行按需引入

### usage 和 entry 的比较

以项目中引入 Promise 为例：

#### entry

```js
// main.js 项目入口文件
...
// 一系列实现 polyfill 的方法
global.Promise = Promise
```

```js
// a.js
const p = new Promise()
```

```js
// b.js
const p = new Promise()
```

#### usage

```js
// main.js 项目入口文件
...
```

```js
// a.js
import 'core-js/modules/es.promise'

const p = new Promise()
```

```js
// b.js
import 'core-js/modules/es.promise'

const p = new Promise()
```

> 可见：usage 也并不是尽善尽美的，项目中存在很多模块的情况下，无疑会多出很多冗余代码

