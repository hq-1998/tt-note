import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/new',
    name: 'new',
    component: () => import('@renderer/views/new/index.vue')
  },
  /** 我的文件夹 */
  {
    path: '/folders',
    name: 'folders',
    component: () => import('@renderer/views/folders/index.vue'),
    children: [
      {
        path: ':id',
        component: () => import('@renderer/views/folders/index.vue')
      }
    ]
  },
  // /** 加星 */
  {
    path: '/star',
    name: 'star',
    component: () => import('@renderer/views/star/index.vue')
  },
  // /** 回收站 */
  {
    path: '/trash',
    component: () => import('@renderer/views/trash/index.vue')
  },
  /** 最新 */
  {
    path: '/',
    redirect: '/new'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.isReady().then(() => {
  const path = window.location.pathname
  if (path === '/index.html' || path === '/') {
    router.replace('/')
  }
})

export default router
