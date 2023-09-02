<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import Sider from '@renderer/layout/sider/index.vue'
import Content from '@renderer/layout/content/index.vue'
import { useNoteStore } from './store'
import { v4 } from 'uuid'

const state = reactive({
  id: '',
  title: '',
  content: '',
  timeStamp: 0
})

const store = useNoteStore()
const currentIndex = ref(0)

onMounted(async () => {
  store.setActive(currentIndex.value)
  const _notes = await window.electron.ipcRenderer.invoke('getNotes')
  const notes = _notes.map((item) => {
    const [id, title, timeStamp] = item.split('__')
    return {
      id,
      title: title,
      content: '',
      timeStamp
    }
  })
  store.setNotes(notes)
  const note = notes[currentIndex.value]
  if (note) {
    state.id = note.id
    state.title = note.title
    state.timeStamp = note.timeStamp
  }
})

const handleAdd = () => {
  store.addNote({ id: v4(), title: '', content: '', timeStamp: Date.now() })
}

const collapse = ref(true)
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
        <Empty v-if="store.notes.length === 0">
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
