<script lang="tsx" setup>
import { ref } from 'vue'
import UserInfoModal from '@renderer/components/user-info-modal/index.vue'
import UploadModal from '@renderer/components/upload-modal/index.vue'

const emits = defineEmits(['handleCollapse'])
const collapsed = ref(true)

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

const toggleModalVisible = () => {
  userInfoRef.value!.toggleModalVisible()
}

const toggleUploadModalVisible = () => {
  uploadRef.value!.toggleModalVisible()
}

const doptionOptions = [
  {
    label: '消息通知',
    value: 'notify',
    icon: <icon-notification />,
    click: toggleModalVisible
  },
  {
    label: '个人信息',
    value: 'message',
    icon: <icon-user />,
    click: toggleModalVisible
  },
  {
    label: '检测更新',
    value: 'update',
    icon: <icon-user />,
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
</script>

<template>
  <div class="menu-wrapper">
    <div class="top-wrapper">
      <div class="avatar-wrapper">
        <a-dropdown show-arrow :popup-translate="collapsed ? [35, 5] : [0, 10]">
          <a-avatar :size="collapsed ? 32 : 64"> <icon-gitlab /></a-avatar>
          <template #content>
            <a-doption v-for="item in doptionOptions" :key="item.value" @click="item.click">
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
          :default-open-keys="['0']"
          @collapse="onCollapse"
        >
          <a-menu-item key="0">
            <template #icon><icon-apps></icon-apps> </template>
            最新
          </a-menu-item>
          <a-sub-menu key="1">
            <template #icon><icon-file /></template>
            <template #title>我的文件夹</template>
            <a-menu-item key="1_0">文件夹-1</a-menu-item>
            <a-menu-item key="1_1">文件夹-2</a-menu-item>
            <a-menu-item key="1_2">文件夹-3</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="2">
            <template #icon><icon-delete></icon-delete></template>
            回收站
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <UserInfoModal ref="userInfoRef" title="个人信息" :modal-visible="modalVisible" />
    <UploadModal ref="uploadRef" title="检测更新" :modal-visible="uploadModalVisible" />
  </div>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
