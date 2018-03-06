## React + Webpack 系列配置

React + Webpack 区分开发、生成环境的打包配置，开发环境下配置热更新、公共文件、第三方文件抽取、代码分割、按需加载、自动生成html模板文件并导入对应的css和js文件，生成环境进行了压缩混淆、其他与开发环境类似；

## 运行

为了项目的正确运行，请确保 npm 或 yarn 已经安装

```sh
# 安装项目依赖
npm install 或 yarn install
# 运行项目
npm start 或 yarn start
```

## 打包

生产环境打包需要使用以下命令

```sh
# 生成dist目录
npm run build:prod 或 yarn build:prod
# dist目录挂载的服务器
npm run prod 或 yarn prod
```

### 参考资料

- [Webpack docs](https://webpack.js.org/concepts/)
- [webpack 多页面构建](https://github.com/shaozj/blog/issues/11)
