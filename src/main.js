import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import CryptoJS from "crypto-js"

Vue.config.productionTip = false

//axios.defaults.baseURL = "http://localhost:8848/";
Vue.use(VueAxios, axios);
Vue.prototype.$axios = axios;

Vue.use(ElementUI);
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent
]);
// 全局注册组件（也可以使用局部注册）
Vue.component('v-chart', ECharts)


Vue.filter("dateFilter", function (dataStr) {
  var dt = new Date(dataStr);
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var day = dt.getDate();
  var hour = dt.getHours();
  var minute = dt.getMinutes();
  var sec = dt.getSeconds();
  return `${year}年${month}月${day}日 ${hour}:${minute}:${sec}`
});

Vue.prototype.youdao = {
  appKey: "695964bc75e4efd0",
  key: "h8fw78HDfrYxJVVlJwvPsF9fqkttehRK"
};

Vue.prototype.CryptoJS = CryptoJS;


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
