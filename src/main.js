import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import VueAxios from "vue-axios";
import ECharts from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import CryptoJS from "crypto-js";

Vue.config.productionTip = false;

//axios.defaults.baseURL = "http://localhost:8848/";
Vue.use(VueAxios, axios);
Vue.prototype.$axios = axios;

Vue.use(ElementUI);
use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);
// 全局注册组件（也可以使用局部注册）
Vue.component("v-chart", ECharts);

Vue.filter("dateFilter", function (dataStr) {
  var dt = new Date(dataStr);
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var day = dt.getDate();
  var hour = dt.getHours();
  var minute = dt.getMinutes();
  var sec = dt.getSeconds();
  return `${year}年${month}月${day}日 ${hour}:${minute}:${sec}`;
});

Vue.prototype.youdao = {
  appKey: "695964bc75e4efd0",
  key: "h8fw78HDfrYxJVVlJwvPsF9fqkttehRK",
};

Vue.prototype.CryptoJS = CryptoJS;

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据进行操作
    console.info("响应拦截器", response);
    if (
      response.data &&
      response.data.success === false &&
      response.data.msg === "未登录"
    ) {
      console.info("清除登录信息", response);
      if (localStorage.getItem("user") || localStorage.getItem("mgruser")) {
        localStorage.removeItem("user");
        localStorage.removeItem("mgruser");
        Vue.prototype.$alert("未登录或登录信息过期，请登录账号！", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            setTimeout(() => {
              window.location.reload();
            }, 100);
          },
        });
      }
      return Promise.reject(error);
    }

    return response;
  },
  function (error) {
    // 对响应错误进行操作
    return Promise.reject(error);
  }
);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
