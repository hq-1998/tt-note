<script setup lang="ts">
import Layout from '@renderer/layout/index.vue'
import { onMounted } from 'vue'
import { globalWebSocket, Events } from '@renderer/websocket'

onMounted(() => {
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
