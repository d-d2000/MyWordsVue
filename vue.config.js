const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: 'localhost',//本地地址
    port: '80',//端口号
    hot: true,//热更新自动刷新
    //open: true,//自动打开
    proxy: {
      "/youdaofanyi": {
        target: "https://openapi.youdao.com/api", //跨域请求的公共地址
        ws: false, //也可以忽略不写，不写不会影响跨域
        changeOrigin: true, //是否开启跨域，值为 true 就是开启， false 不开启
        secure: false,
        pathRewrite: { //重写路径 替换请求地址中的指定路径
          ['^/youdaofanyi']: '/' //将请求地址中的api替换为空
        }
      },
      "/local": {
        target: "http://127.0.0.1:8080", //跨域请求的公共地址
        ws: false, //也可以忽略不写，不写不会影响跨域
        changeOrigin: true, //是否开启跨域，值为 true 就是开启， false 不开启
        secure: false,
        pathRewrite: { //重写路径 替换请求地址中的指定路径
          ['^/local']: '/' //将请求地址中的api替换为空
        }
      },
    },
  },
});
