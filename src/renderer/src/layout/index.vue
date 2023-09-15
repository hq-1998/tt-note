<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import Sider from '@renderer/layout/sider/index.vue'
import Content from '@renderer/layout/content/index.vue'
import { useNoteStore, useUserStore, useAreaStore } from '../store'
import { onBeforeMount } from 'vue'
import { globalStorage, generateNote, shallowMergeObject } from '../utils'
import { globalWebSocket, Events } from '@renderer/websocket'
import { user, area } from '../api'
import { IBaseNote } from '../store/note'
import { IUserInfo } from '../api/user/data'
import { IProvince } from '../api/area/data'
import BaseEmpty from '@renderer/components/base-empty'
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
    isClickRename: false
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

const handleAdd = () => {
  noteStore.addNote(ENoteType.MARKDOWN)
}

const handleCollapse = (e) => {
  collapse.value = e
}

const width = computed(() => {
  return collapse.value ? 258 : 400
})
</script>

<template>
  <a-layout class="layout">
    <a-layout>
      <a-layout-sider breakpoint="lg" :width="width">
        <Sider @handle-collapse="handleCollapse">
          <template #content>
            <RouterView />
          </template>
        </Sider>
      </a-layout-sider>
      <a-layout-content>
        <BaseEmpty v-if="(noteStore.notes[noteStore.activeType] || []).length === 0">
          <template #extra>
            <a-button size="medium" class="add-note" type="primary">
              <template #icon>
                <icon-plus />
              </template>
              <template #default>
                <div @click="handleAdd">新建笔记</div>
              </template>
            </a-button>
          </template></BaseEmpty
        >
        <Content v-else />
      </a-layout-content>
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
