import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
// RESAS APIのBaseURLとAPIKeyを設定（.envに保存）
axios.defaults.baseURL = process.env.VUE_APP_API_ENDPOINT;
axios.defaults.headers = { "X-API-KEY": process.env.VUE_APP_API_KEY };

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
