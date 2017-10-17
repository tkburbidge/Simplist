import Vue from 'vue'
import Router from 'vue-router'
import ListsIndex from '@/components/ListsIndex'
import ListDetail from '@/components/ListDetail'
import { requireAuth } from '@/data/auth'
import Login from '@/components/Login'
import SidebarLayout from '@/components/SidebarLayout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      component: Login
    },
    {
      path: '/',
      component: SidebarLayout,
      children: [
        {
          path: '/Lists',
          name: 'ListsIndex',
          beforeEnter: requireAuth,
          components: {
            default: ListsIndex
          }
        },
        {
          path: '/Lists/:id',
          name: 'ListDetail',
          beforeEnter: requireAuth,
          components: {
            default: ListsIndex,
            detail: ListDetail
          }
        }
      ]
    }
  ]
})
