<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import Sider from '@renderer/layout/sider/index.vue'
import Content from '@renderer/layout/content/index.vue'
import { useNoteStore, useUserStore, useAreaStore } from '../store'
import { v4 } from 'uuid'
import { onBeforeMount } from 'vue'
import { globalStorage, generateNote, shallowMergeObject } from '../utils'
import { globalWebSocket, Events } from '@renderer/websocket'
import { user, area } from '../api'
import { ENoteType, IBaseNote } from '../store/note'
import { IUserInfo } from '../api/user/data'
import { IProvince } from '../api/area/data'

const areaStore = useAreaStore()
const noteStore = useNoteStore()
const userStore = useUserStore()

const collapse = ref(true)
const currentIndex = ref(0)

const state = reactive({
  data: {
    id: '',
    title: '',
    content: '',
    suffix: '',
    timeStamp: 0
  }
})

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
  const notes = await generateNote()
  noteStore.setNotes(notes)
  const note = notes[ENoteType.MARKDOWN][currentIndex.value]
  if (note) {
    state.data = shallowMergeObject(state.data, note) as IBaseNote
  }

  const unsubscribe = globalWebSocket.subscribe(Events.OTHER, () => {
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
    type: ENoteType.MARKDOWN,
    suffix: `.${ENoteType.MARKDOWN}`,
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
        <Sider @handle-collapse="handleCollapse">
          <template #content>
            <RouterView />
          </template>
        </Sider>
      </a-layout-sider>
      <a-layout-content>
        <Empty v-if="(noteStore.notes[noteStore.activeType] || []).length === 0">
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

<style lang="less">
.arco-drawer-body {
  padding: 0px;
}
</style>
