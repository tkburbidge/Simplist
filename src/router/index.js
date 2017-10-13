import Vue from 'vue'
import Router from 'vue-router'
import ListsIndex from '@/components/ListsIndex'
import ListDetail from '@/components/ListDetail'
// import { requireAuth } from '@/data/auth'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: ListsIndex
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/Lists',
      name: 'ListsIndex',
      // beforeEnter: requireAuth,
      component: ListsIndex
    },
    {
      path: '/Lists/:id',
      name: 'ListDetail',
      // beforeEnter: requireAuth,
      components: {
        default: ListsIndex,
        detail: ListDetail
      }
    }
  ]
})
