import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.config.productionTip = false

//axios.defaults.baseURL = "http://localhost:8848/";
Vue.prototype.$axios = axios;
Vue.use(ElementUI);


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


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
