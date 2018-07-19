
import Vue from "vue";
import App from "./App.vue";
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import lodash from 'lodash';    
// Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);


Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
  render: h => h(App)
}).$mount("#app");

