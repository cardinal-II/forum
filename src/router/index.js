import { createRouter, createWebHistory } from 'vue-router'
import { get_env_vars } from "@/plugins/utilities.mjs";
const env_vars = get_env_vars();

const routes = [
  {
    path: '/',
    redirect: "/play",
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/play',
    name: 'play',
    component: () => import('@/views/PlayView.vue')
  },
  {
    path: '/stat',
    name: 'statistics',
    component: () => import('@/views/StatView.vue')
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
    //component: NotFound
  }
]

const router = createRouter({

  history: createWebHistory(env_vars.VITE_ENV == 'development' ? '/' : env_vars.VITE_PRODUCTION_FRONT_DIRECTORY),
  base: env_vars.VITE_ENV == 'development' ? '/' : env_vars.VITE_PRODUCTION_FRONT_DIRECTORY,
  routes: routes
})

export { routes }

export default router
