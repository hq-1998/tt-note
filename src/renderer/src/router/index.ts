import VueRouter, { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  /** 最新 */
  {
    path: '/',
    // redirect: '/new',
    component: () => import('@/views/New.vue')
  },
  /** 我的文件夹 */
  {
    path: '/folders',
    component: () => import('@/views/Folder.vue'),
    children: [
      {
        path: ':id',
        component: () => import('@/views/Folder.vue')
      }
    ]
  },
  /** 加星 */
  {
    path: '/star',
    component: () => import('@/views/Star.vue')
  },
  /** 回收站 */
  {
    path: '/trash',
    component: () => import('@/views/Trash.vue')
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

export default router
