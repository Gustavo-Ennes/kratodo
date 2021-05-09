import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'
import vueMeta from 'vue-meta'

require('dotenv').config()

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(vueMeta)

new Vue({
  render: h => h(App),
}).$mount('#app')
