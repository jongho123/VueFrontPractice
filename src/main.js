import Vue from 'vue';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import App from './App.vue';
import router from './router';

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
