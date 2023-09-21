<script setup lang="ts">
import Layout from '@renderer/layout/index.vue'
import { onMounted } from 'vue'
import { globalWebSocket, Events } from '@renderer/websocket'
import { useUserStore, useAreaStore } from '@renderer/store'
import { useNoteStore } from './store'
import { onBeforeMount } from 'vue'
import { globalStorage } from '@renderer/utils'
import { user, area } from '@renderer/api'
import { IUserInfo } from '@renderer/api/user/data'
import { IProvince } from '@renderer/api/area/data'

const noteStore = useNoteStore()
const areaStore = useAreaStore()
const userStore = useUserStore()

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
  const { result, noteMaps } = await window.electron.ipcRenderer.invoke('getNotes')
  noteStore.setNotes(result)
  noteStore.setNotesMap(noteMaps)

  const unsubscribe = globalWebSocket.subscribe(Events.OTHER, () => {
    window.electron.ipcRenderer.invoke('sendNotification', {
      title: '欢迎光临',
      body: '这是您首次登录小腾笔记，请享受您的笔记之旅'
    })
    unsubscribe?.()
  })
})
</script>

<template>
  <Layout />
</template>
