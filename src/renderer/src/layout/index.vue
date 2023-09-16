<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Sider from '@renderer/layout/sider/index.vue'
import { useNoteStore, useUserStore, useAreaStore } from '../store'
import { onBeforeMount } from 'vue'
import { globalStorage } from '../utils'
import { globalWebSocket, Events } from '@renderer/websocket'
import { user, area } from '../api'
import { IUserInfo } from '../api/user/data'
import { IProvince } from '../api/area/data'

const areaStore = useAreaStore()
const noteStore = useNoteStore()
const userStore = useUserStore()

const collapse = ref(true)
const currentIndex = ref(0)

onBeforeMount(() => {
  const token = globalStorage.get('token')
  const userInfo = globalStorage.get('userInfo')
  if (token && userInfo) {
    userStore.setToken(token)
    globalWebSocket.connect(userInfo.id)
    const promises = [user.getUserInfo(userInfo.id), area.getProvince()]
    Promise.all(promises).then((res) => {
      const [userInfo, province] = res
      if (userInfo.code === 0) {
        userStore.setUserInfo(userInfo.data as IUserInfo)
      }
      if (province.code === 0) {
        areaStore.setProvince(province.data as IProvince[])
      }
    })
  }
})

onMounted(async () => {
  noteStore.setActive(currentIndex.value)
  const { result, treeMap } = await window.electron.ipcRenderer.invoke('getNotes')
  noteStore.setNotes(result)
  noteStore.setNotesMap(treeMap)

  const unsubscribe = globalWebSocket.subscribe(Events.OTHER, () => {
    window.electron.ipcRenderer.invoke('sendNotification', {
      title: '欢迎光临',
      body: '这是您首次登录小腾笔记，请享受您的笔记之旅'
    })
    unsubscribe?.()
  })
})

const handleCollapse = (e) => (collapse.value = e)

const width = computed(() => (collapse.value ? 48 : 200))
</script>

<template>
  <a-layout class="layout">
    <a-layout>
      <a-layout-sider breakpoint="lg" :width="width">
        <Sider @handle-collapse="handleCollapse"> </Sider>
      </a-layout-sider>
      <RouterView />
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
