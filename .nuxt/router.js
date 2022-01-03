import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4f11467e = () => interopDefault(import('../pages/bookedit.vue' /* webpackChunkName: "pages/bookedit" */))
const _6da19556 = () => interopDefault(import('../pages/booklist.vue' /* webpackChunkName: "pages/booklist" */))
const _70d25a7c = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _36451149 = () => interopDefault(import('../pages/sokudoku.vue' /* webpackChunkName: "pages/sokudoku" */))
const _b7bf7a5e = () => interopDefault(import('../pages/sokudoku-top.vue' /* webpackChunkName: "pages/sokudoku-top" */))
const _812f58fc = () => interopDefault(import('../pages/sokutore.vue' /* webpackChunkName: "pages/sokutore" */))
const _ee147eec = () => interopDefault(import('../pages/sokutore-top.vue' /* webpackChunkName: "pages/sokutore-top" */))
const _92036218 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/portfolio/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/bookedit",
    component: _4f11467e,
    name: "bookedit"
  }, {
    path: "/booklist",
    component: _6da19556,
    name: "booklist"
  }, {
    path: "/inspire",
    component: _70d25a7c,
    name: "inspire"
  }, {
    path: "/sokudoku",
    component: _36451149,
    name: "sokudoku"
  }, {
    path: "/sokudoku-top",
    component: _b7bf7a5e,
    name: "sokudoku-top"
  }, {
    path: "/sokutore",
    component: _812f58fc,
    name: "sokutore"
  }, {
    path: "/sokutore-top",
    component: _ee147eec,
    name: "sokutore-top"
  }, {
    path: "/",
    component: _92036218,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
