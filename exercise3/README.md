# @babel/runtime & @babel/plugin-transform-runtime polyfill

通过 @babel/polyfill 或自主引入 core-js 实现 polyfill 是存在污染全局变量的副作用的，因此在实现 polyfill 时 Babel 还提供了另外一种方式实现不污染全局变量的 polyfill

- @babel/runtime 包提供辅助函数和 regeneratorRuntime
- @babel/runtime-corejs2 包在 @babel/runtime 的基础上还提供非全局的 core-js 2.0
- @babel/runtime-corejs3 包在 @babel/runtime 的基础上还提供非全局的 core-js 3.0
- @babel/plugin-transform-runtime 包用来配合上述三个包使用，它会根据配置自动调用三个包其中之一

## [@babel/plugin-transform-runtime Options](https://babeljs.io/docs/en/babel-plugin-transform-runtime)

### corejs

该参数用来配置使用上述三个包中的哪一个、是否进行 polyfill

- false 配合 @babel/runtime 使用，项目中需要安装 @babel/runtime 作为运行时依赖；不提供 polyfill
- 2 配合 @babel/runtime-corejs2 使用，项目中需要安装 @babel/runtime-corejs2 作为运行时依赖；提供非全局的 core-js 2 polyfill
- 3 配合 @babel/runtime-corejs3 使用，项目中需要安装 @babel/runtime-corejs3 作为运行时依赖；提供非全局的 core-js 3 polyfill

### helpers

该参数用来配置对辅助函数的使用方式

- false 这种情况下，辅助函数会内联在 Babel 转译出来的代码中，假如有多个文件，内联辅助函数就会越多，反而冗余了
- true 这种情况下，辅助函数是通过引用 @babel/runtime[-corejs2|-corejs3]/helpers 导入的，配合一些打包工具，能够有效减小打包的体积

### regenerator

该参数用来配置是否使用 @babel/runtime[-corejs2|-corejs3]/regenerator 中的不污染全局范围的 regeneratorRuntime

> 虽说使用的 regeneratorRuntime 是不污染全局范围的，但是在引用过程中依旧会声明一个全局变量 regeneratorRuntime

```js
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
```

```js
// @babel/runtime-corejs3/regenerator
// TODO(Babel 8): Remove this file.

var runtime = require("../helpers/regeneratorRuntime")();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
```

## 总结

推荐方案：

- 开发应用：@babel/preset-env 实现语法转译、@babel/polyfill 或自主引入 core-js  实现 polyfill、@babel/plugin-transform-runtime 实现辅助函数解冗，引入 regeneratorRuntime
- 开发库：@babel/preset-env 实现语法转译、@babel/plugin-transform-runtime 配合 @babel/runtime-corejs[2|3] 实现 polyfill，辅助函数解冗，引入 regeneratorRuntime

> 安装 @babel/preset-env 时也会安装 @babel/runtime，通过查看依赖关系可以发现

## 补充

- helpers 为 true 时：
  - regenerator 为 true 时：使用 @babel/runtime[-corejs2|-corejs3]/regenerator 中的不污染全局范围的 regeneratorRuntime，但是使用过程中会声明一个全局变量 regeneratorRuntime
  - regenerator 为 false 时：直接使用全局变量 regeneratorRuntime，如果没有这个全局变量就会运行出错
- helpers 为 false 时：regenerator 参数失效，Babel 7.18.0 前也是直接使用全局变量 regeneratorRuntime，Babel 7.18.0 后因为 Babel 内置了 regenerate-runtime，因此使用 _regeneratorRuntime（Perfect！）