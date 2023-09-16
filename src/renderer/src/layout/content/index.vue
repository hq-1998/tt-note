<template>
  <div class="wrapper">
    <div class="title-wrapper">
      <DivEditable :value="data.title || '无标题笔记'" @update:value="handleUpdateTitle" />
      <div class="title-btns">
        <a-button size="medium" @click="handleSave">保存</a-button>
      </div>
    </div>
    <div class="editor">
      <Editor :value="data.content" @update:value="handleUpdateContent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import DivEditable from '@renderer/components/editor-element/index.vue'
import { Message } from '@arco-design/web-vue'
import { useNoteStore } from '@renderer/store'
import { ENoteType } from '../menu/constants'
import { IBaseNote } from '@renderer/store/note'

const store = useNoteStore()
const props = defineProps<{ data: IBaseNote }>()

const handleUpdateTitle = (v) => {
  store.updateNoteById(props.data.id, { title: v })
}

const handleUpdateContent = (v) => {
  store.updateNoteById(props.data.id, { content: v })
}

const handleSave = async () => {
  const { id, title, content } = props.data
  if (!id) return
  await window.electron.ipcRenderer.invoke(
    'save',
    JSON.stringify({
      payload: {
        id,
        title,
        content,
        ext: `.${ENoteType.MARKDOWN}`
      }
    })
  )
  Message.success('保存成功')
}

watch(
  () => props.data.id,
  async (id) => {
    if (!id) return
    const content = await store.getNoteById(id)
    if (props.data.type !== ENoteType.DIR) {
      store.updateNoteById(id, { content })
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="less" scoped>
@import './style.less';
</style>
