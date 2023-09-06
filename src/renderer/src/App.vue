<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import Sider from '@renderer/layout/sider/index.vue'
import Content from '@renderer/layout/content/index.vue'
import { useNoteStore, useUserStore } from './store'
import { v4 } from 'uuid'
import { onBeforeMount } from 'vue'
import { globalStorage } from './utils'
import { globalWebSocket, Events } from '@renderer/websocket'
import { user } from './api'

const noteStore = useNoteStore()
const userStore = useUserStore()

const collapse = ref(true)
const currentIndex = ref(0)

const state = reactive({
  id: '',
  title: '',
  content: '',
  timeStamp: 0
})

onBeforeMount(() => {
  const token = globalStorage.get('token')
  const userInfo = globalStorage.get('userInfo')
  if (token && userInfo) {
    userStore.setToken(token)
    userStore.setUserInfo(userInfo)
    globalWebSocket.connect(userInfo.id)
    user.getUserInfo(userInfo.id).then((res) => {
      if (res.code === 0) {
        userStore.setUserInfo(res.data)
      }
    })
  }
})

onMounted(async () => {
  noteStore.setActive(currentIndex.value)
  const _notes = await window.electron.ipcRenderer.invoke('getNotes')
  const notes = _notes.map((item) => {
    const [id, title, timeStampAndExt] = item.split('__')
    const [timeStamp] = timeStampAndExt.split('.')
    return {
      id,
      title,
      content: '',
      timeStamp
    }
  })
  noteStore.setNotes(notes)
  const note = notes[currentIndex.value]
  if (note) {
    state.id = note.id
    state.title = note.title
    state.timeStamp = note.timeStamp
  }

  const unsubscribe = globalWebSocket.subscribe(Events.OTHER, (data) => {
    console.log(data, '==data==')
    window.electron.ipcRenderer.invoke('sendNotification', {
      title: '欢迎光临',
      body: '这是您首次登录小腾笔记，请享受您的笔记之旅'
    })
    unsubscribe?.()
  })
})

const handleAdd = async () => {
  const payload = {
    id: v4(),
    title: '',
    content: '',
    timeStamp: Date.now(),
    isClickRename: false
  }
  await window.electron.ipcRenderer.invoke('save', payload)
  noteStore.addNote(payload)
}

const dynamicSiderWidth = computed(() => {
  return collapse.value ? 254 : 400
})

const handleCollapse = (e) => {
  collapse.value = e
}
</script>

<template>
  <a-layout style="height: 100vh">
    <a-layout>
      <a-layout-sider breakpoint="lg" :width="dynamicSiderWidth">
        <Sider @handle-collapse="handleCollapse" />
      </a-layout-sider>
      <a-layout-content>
        <Empty v-if="noteStore.notes.length === 0">
          <template #extra>
            <a-button type="outline">
              <template #icon>
                <icon-plus />
              </template>
              <template #default>
                <div @click="handleAdd">新建笔记</div>
              </template>
            </a-button>
          </template></Empty
        >
        <Content v-else />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="less"></style>
