<script lang="tsx" setup>
import { ref, computed } from 'vue'
import UserInfoModal from '@renderer/components/user-info-modal/index.vue'
import UploadModal from '@renderer/components/upload-modal/index.vue'
import DrawerComponent from '@renderer/components/drawer/index.vue'
import VirtualScrollList from '@renderer/components/virtual-scroll-list/index.vue'
import document from '@renderer/assets/images/icons/document.png'
import directory from '@renderer/assets/images/icons/directory.png'
import { useNoteStore, useUserStore } from '@renderer/store'
import { Message } from '@arco-design/web-vue'
import { ENoteType } from '@renderer/store/note'
import PAYLOAD from './constants'
import { user } from '@renderer/api'
import { useRouter } from 'vue-router'
import { menuKey } from '@renderer/router/menuKey'
import BaseMore, { type IOption } from '@renderer/components/base-more'

const emits = defineEmits(['handleCollapse'])
const collapsed = ref(true)
const visible = ref(false)
const router = useRouter()

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
    value: 'notify',
    icon: <icon-notification />,
    click: toggleDrawerVisible
  },
  {
    label: '个人信息',
    value: 'message',
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
    value: 'update',
    icon: <icon-sync />,
    click: toggleUploadModalVisible
  },
  {
    label: '退出登录',
    value: 'exit',
    icon: <icon-export />,
    click: () => {
      window.electron.ipcRenderer.invoke('closeWindow')
      window.electron.ipcRenderer.invoke('openSingleWindow', 'login')
    }
  }
]

const noteStore = useNoteStore()
const userStore = useUserStore()

const createDoptionOptions: IOption[] = [
  {
    label: 'MarkDown',
    value: 'notify',
    icon: <img width={14} height={14} src={document} />,
    click: async () => {
      const payload = PAYLOAD[ENoteType.MARKDOWN]
      await window.electron.ipcRenderer.invoke('save', payload)
      noteStore.addNote(payload)
    }
  },
  {
    label: '新建文件夹',
    value: 'message',
    icon: <img width={14} height={14} src={directory} />,
    click: async () => {
      const payload = PAYLOAD[ENoteType.DIR]
      await window.electron.ipcRenderer.invoke('createDir', payload)
      noteStore.addNoteDir(payload)
    }
  }
]

const noteDirs = computed(() => {
  return noteStore.notes?.dir || []
})

const onMenuClick = (key: string) => {
  router.push(`/${key}`)
}
</script>

<template>
  <div class="menu-wrapper">
    <div class="top-wrapper">
      <div :class="['user-wrapper', collapsed && 'remove-padding']">
        <div class="avatar-wrapper">
          <a-dropdown trigger="hover" show-arrow :popup-translate="collapsed ? [32, 5] : [0, 10]">
            <!-- <a-image-preview-group
              v-model:visible="visible"
              :current="0"
              class="preview"
              :src-list="userStore.userInfo.avatar ? [userStore.userInfo.avatar] : []"
            > -->
            <a-avatar
              :size="collapsed ? 32 : 64"
              :image-url="userStore.userInfo?.avatar || ''"
              @click="visible = true"
              ><icon-gitlab
            /></a-avatar>
            <!-- </a-image-preview-group> -->

            <template #content>
              <a-doption v-for="item in doptionOptions" :key="item.value" @click="item.click">
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
            <a-doption v-for="item in createDoptionOptions" :key="item.value" @click="item.click">
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
          :default-open-keys="['new']"
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
              v-for="item in noteDirs"
              :key="`${menuKey.FOLDERS}/${item.id}`"
              class="folder"
            >
              <span>{{ item.title || '新建文件夹' }}</span>
              <BaseMore
                class="icon-more"
                position="bl"
                :options="createDoptionOptions"
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
