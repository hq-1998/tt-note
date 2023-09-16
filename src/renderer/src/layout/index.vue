<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import Sider from '@renderer/layout/sider/index.vue'
import { useNoteStore, useUserStore, useAreaStore } from '../store'
import { onBeforeMount } from 'vue'
import { globalStorage, generateNote, shallowMergeObject } from '../utils'
import { globalWebSocket, Events } from '@renderer/websocket'
import { user, area } from '../api'
import { IBaseNote } from '../store/note'
import { IUserInfo } from '../api/user/data'
import { IProvince } from '../api/area/data'
import { ENoteType } from './menu/constants'

const areaStore = useAreaStore()
const noteStore = useNoteStore()
const userStore = useUserStore()

const collapse = ref(true)
const currentIndex = ref(0)

const state = reactive<{
  data: IBaseNote
}>({
  data: {
    id: '',
    title: '',
    content: '',
    ext: '',
    timestamp: '',
    type: ENoteType.MARKDOWN,
    isClickRename: false,
    fullname: ''
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
  const note = notes[ENoteType.MARKDOWN]?.[currentIndex.value]
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

const handleCollapse = (e) => {
  collapse.value = e
}

const width = computed(() => {
  return collapse.value ? 48 : 200
})
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
.layout {
  height: 100vh;

  :deep(.arco-layout-sider-children) {
    overflow: hidden;
  }

  :deep(.arco-drawer-body) {
    padding: 0px;
  }
}

.add-note {
  margin-top: 10px;
}
</style>
