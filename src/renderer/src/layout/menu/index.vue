<script lang="tsx" setup>
import { ref } from 'vue'
import UserInfoModal from '@renderer/components/user-info-modal/index.vue'
import UploadModal from '@renderer/components/upload-modal/index.vue'
import DrawerComponent from '@renderer/components/drawer/index.vue'
import VirtualScrollList from '@renderer/components/virtual-scroll-list/index.vue'
import { useNoteStore, useUserStore } from '@renderer/store'
import { Message } from '@arco-design/web-vue'
import {
  ENoteType,
  OPTION_KEY,
  createDoptionOptions,
  fileDoptionOptions,
  keyMap
} from './constants'
import { user } from '@renderer/api'
import { useRoute, useRouter } from 'vue-router'
import { menuKey } from '@renderer/router/menuKey'
import BaseMore, { type IOption } from '@renderer/components/base-more'
import { IBaseNote } from '@renderer/store/note'

const emits = defineEmits(['handleCollapse'])

const collapsed = ref(true)
const visible = ref(false)

const router = useRouter()
const route = useRoute()
const noteStore = useNoteStore()
const userStore = useUserStore()

const onCollapse = (val) => {
  collapsed.value = val
  emits('handleCollapse', val)
}

/** 个人信息 */
const modalVisible = ref(false)
const userInfoRef = ref<{
  toggleModalVisible: () => void
}>()

/** 检测更新 */
const uploadModalVisible = ref(false)
const uploadRef = ref<{
  toggleModalVisible: () => void
}>()

/** 消息中心 */
const messageDrawerVisible = ref(false)

const toggleModalVisible = () => {
  userInfoRef.value!.toggleModalVisible()
}

const toggleDrawerVisible = () => {
  messageDrawerVisible.value = !messageDrawerVisible.value
}

const toggleUploadModalVisible = async () => {
  const existUpdate = await window.electron.ipcRenderer.invoke('patchUrlAndDownload', {
    url: 'https://hq-cll-1259560137.cos.ap-nanjing.myqcloud.com/dist1/electron-app-1.0.2-setup.exe'
  })
  if (existUpdate) {
    uploadRef.value!.toggleModalVisible()
  } else {
    Message.warning('当前已是最新版本')
  }
}

const doptionOptions = [
  {
    label: '消息通知',
    key: 'notify',
    icon: <icon-notification />,
    click: toggleDrawerVisible
  },
  {
    label: '个人信息',
    key: 'message',
    icon: <icon-user />,
    click: () => {
      user.getUserInfo(userStore.userInfo.id).then((res) => {
        if (res.code === 0) {
          userStore.setUserInfo(res.data)
          toggleModalVisible()
        }
      })
    }
  },
  {
    label: '检测更新',
    key: 'update',
    icon: <icon-sync />,
    click: toggleUploadModalVisible
  },
  {
    label: '退出登录',
    key: 'exit',
    icon: <icon-export />,
    click: () => {
      window.electron.ipcRenderer.invoke('closeWindow')
      window.electron.ipcRenderer.invoke('openSingleWindow', 'login')
    }
  }
]

const onMenuClick = async (key: string) => {
  const children = key.split('/')
  const activeType = keyMap[children[0]]
  const isDir = activeType === ENoteType.DIR
  const index = isDir ? noteStore.dirNotes.findIndex((item) => item.id === children[1]) : 0
  console.log(isDir ? noteStore.dirNotes[index]?.children[0] : noteStore.fileNotes[index], '111')
  noteStore.setCurrentItem(
    isDir ? noteStore.dirNotes[index]?.children[0] : noteStore.fileNotes[index]
  )
  noteStore.setActiveType(activeType)
  router.push(`/${key}`)
}

const handleClick = async (option: IOption, item?: IBaseNote) => {
  const { key } = option
  const parentId = (route.params.id as string) ?? ''
  try {
    switch (key) {
      case OPTION_KEY.MARKDOWN:
      case OPTION_KEY.DIR:
        {
          const successId = await noteStore.addNote(key, parentId)
          if (successId) {
            Message.success('新建成功')
          }
        }
        break
      case OPTION_KEY.DELETE:
        if (item) {
          await noteStore.removeNoteDirById(item.id)
          Message.success('删除成功')
        }
        break
    }
  } catch (error) {
    Message.error((error as { message: string }).message)
  }
}
</script>

<template>
  <div class="menu-wrapper">
    <div class="top-wrapper">
      <div :class="['user-wrapper', collapsed && 'remove-padding']">
        <div class="avatar-wrapper">
          <a-dropdown trigger="hover" show-arrow :popup-translate="collapsed ? [32, 5] : [0, 10]">
            <a-avatar
              :size="collapsed ? 32 : 64"
              :image-url="userStore.userInfo?.avatar || ''"
              @click="visible = true"
              ><icon-gitlab
            /></a-avatar>
            <template #content>
              <a-doption v-for="item in doptionOptions" :key="item.key" @click="item.click">
                {{ item.label }}
                <template #icon> <component :is="item.icon" /> </template
              ></a-doption>
            </template>
          </a-dropdown>
        </div>
        <a-dropdown show-arrow :popup-translate="collapsed ? [42, 5] : [0, 10]">
          <div class="create">
            <icon-plus class="plus-icon" />
            <span v-if="!collapsed" class="create-text">新建</span>
          </div>
          <template #content>
            <a-doption
              v-for="item in createDoptionOptions"
              :key="item.key"
              @click="handleClick(item)"
            >
              {{ item.label }}
              <template #icon> <component :is="item.icon" /> </template
            ></a-doption>
          </template>
        </a-dropdown>
      </div>

      <div class="menu-list-wrapper">
        <a-menu
          v-model:collapsed="collapsed"
          show-collapse-button
          :style="{ width: '200px', height: '100%' }"
          :default-open-keys="[menuKey.NEW]"
          :default-selected-keys="[menuKey.NEW]"
          @menu-item-click="onMenuClick"
          @collapse="onCollapse"
        >
          <a-menu-item :key="menuKey.NEW">
            <template #icon><icon-apps /></template>
            最新
          </a-menu-item>
          <a-sub-menu :key="menuKey.FOLDERS" selectable>
            <template #icon><icon-folder /></template>
            <template #title>我的文件夹</template>
            <a-menu-item
              v-for="item in noteStore.dirNotes"
              :key="`${menuKey.FOLDERS}/${item.id}`"
              class="folder"
            >
              <span>{{ item.title || '新建文件夹' }}</span>
              <BaseMore
                class="icon-more"
                position="bl"
                :options="fileDoptionOptions"
                @handle-click="(option) => handleClick(option, item)"
                @click.stop
              />
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item :key="menuKey.STAR">
            <template #icon><icon-star /></template>
            加星
          </a-menu-item>
          <a-menu-item :key="menuKey.TRASH">
            <template #icon><icon-delete></icon-delete></template>
            回收站
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <UserInfoModal ref="userInfoRef" title="个人信息" :modal-visible="modalVisible" />
    <UploadModal ref="uploadRef" :modal-visible="uploadModalVisible" />
    <DrawerComponent v-model:visible="messageDrawerVisible" :footer="false">
      <template #header>
        <div class="drawer-header">
          <span class="header-title">消息</span>
          <div class="read-close">
            <span>全部已读</span>
            <icon-close @click="toggleDrawerVisible" />
          </div>
        </div>
      </template>
      <VirtualScrollList />
    </DrawerComponent>
  </div>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
