// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import fire from '@/data/fire'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import FullLoading from '@/components/FullLoading'

Vue.config.productionTip = false
Vue.use(VueFire)
Vue.use(VueMaterial)
Vue.material.registerTheme({
  default: {
    primary: 'blue',
    accent: 'pink',
    warn: 'red',
    background: 'white'
  },
  white: {
    primary: 'white',
    accent: 'pink',
    warn: 'red',
    background: 'grey',
    textColor: 'blue'
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#loading',
  template: '<FullLoading/>',
  components: { FullLoading }
})

fire.auth().onAuthStateChanged((user) => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
})
