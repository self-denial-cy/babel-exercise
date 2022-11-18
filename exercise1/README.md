# Babel

## Babel 中的 Preset

所谓 Preset 就是一些 Plugin 的集合，可以理解为一系列 Plugin 的整合包

以下是三个最常用的 Preset：

### @babel/preset-env

它是一个智能预设，可以将高版本的 Javascript 根据内置规则转译为低版本的 Javascript

它内部集成了绝大多数的转译 Plugin（State > 3），根据对应的参数进行转译

> 它不会包含任何低于 State3 的 Javascript 语法提案，如果需要兼容低于 State3 的语法则需要额外引入对应的 Plugin 进行转译

> 注意：该预设仅仅针对语法的转译，比如说转译箭头函数、const、let 语法
>
> 针对一些 API、新增特性是无法进行转译的，这些需要通过 polyfill 处理

### @babel/preset-react

顾名思义，适用于 React 开发的预设（暂时没深入接触过 React，跳过先）

### @babel/preset-typescript

对于 Typescript，有两种方式将其编译为 Javascript

- 使用 tsc 命令，结合 cli 命令行参数或 tsconfig 配置文件进行编译
- 使用 babel，通过该预设进行编译

## Babel 中的 Plugin

常见的 Plugin 大多数已经集成在 @babel/preset-env 预设中，当项目中需要支持更新的 Javascript 语法时，可以去 [Babel 官网](https://babeljs.io/docs/en/plugins-list) 找到对应的 Plugin 引入

## Polyfill

首先理清楚三个概念：

- 最新 ES 语法：箭头函数、let、const 等
- 最新 ES API：Promise 等
- 最新 ES 实例/静态方法：Array.from、arr.includes 等

@babel/preset-env 仅仅只会转译最新的 ES 语法，并不会转译相应的 API 和实例/静态方法，这时就得引入 polyfill 实现相应的 API 和方法

语法层面的转译 @babel/preset-env 完全可以胜任，但是一些内置方法模块，仅仅通过 @babel/preset-env 的语法转译是无法进行识别转化的，所以就需要一系列类似 【垫片】 的工具进行补充实现这部分内容的低版本代码实现，这就是 polyfill

