import Vue from 'vue'
import VueAxios from 'vue-axios'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'
import vueMeta from 'vue-meta'
import VueCookies from 'vue-cookies'
import axios from 'axios'

require('dotenv').config()

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://api.ennes.dev/kratodo/'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(vueMeta)
Vue.use(VueCookies)
Vue.use(VueAxios, axios)

new Vue({
  render: h => h(App),
}).$mount('#app')
