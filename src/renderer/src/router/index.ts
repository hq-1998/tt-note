import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { menuKey } from './menuKey'

const generateMenu = (name: string) => {
  return {
    path: `/${name}`,
    name
  }
}

const routes: Readonly<RouteRecordRaw[]> = [
  /** 最新 */
  {
    ...generateMenu(menuKey.NEW),
    component: () => import('@renderer/views/new/index.vue')
  },
  /** 我的文件夹 */
  {
    ...generateMenu(menuKey.FOLDERS),
    component: () => import('@renderer/views/folders/index.vue'),
    children: [
      {
        path: ':id',
        component: () => import('@renderer/views/folders/index.vue'),
        meta: {
          /* 标记菜单层级 */
          level: 2
        }
      }
    ]
  },
  // /** 加星 */
  {
    ...generateMenu(menuKey.STAR),
    component: () => import('@renderer/views/star/index.vue')
  },
  // /** 回收站 */
  {
    ...generateMenu(menuKey.TRASH),
    component: () => import('@renderer/views/trash/index.vue')
  },
  /** 最新 */
  {
    path: menuKey.default,
    redirect: menuKey.NEW
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.isReady().then(() => {
  const path = window.location.pathname
  if (path === '/index.html' || path === menuKey.default) {
    router.replace(menuKey.default)
  }
})

export default router
