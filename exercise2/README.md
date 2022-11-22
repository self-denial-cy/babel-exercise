# core-js@3 polyfill

Babel 7.4.0 后，推荐自主引入 core-js 实现 polyfill

同时，更推荐引入 core-js 3：

> core-js@<3.23.3 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Some versions have web compatibility issues. Please, upgrade your dependencies to the actual version of core-js.

Babel 7.18.0 前，如果项目中使用了 Generator 或 async 语法，还需要引入 regenerator-runtime 这个包

当前示例中，因为使用的 Babel > 7.18.0，所以只需要引入 core-js 即可