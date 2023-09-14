<template>
  <div class="wrapper">
    <div class="title-wrapper">
      <DivEditable :value="currentItem.title || '无标题笔记'" @update:value="handleUpdateTitle" />
      <div class="title-btns">
        <a-button size="medium" @click="handleSave">保存</a-button>
      </div>
    </div>
    <div class="editor">
      <Editor :value="currentItem.content" @update:value="handleUpdateContent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, toRaw } from 'vue'
import DivEditable from '@renderer/components/editor-element/index.vue'
import { Message } from '@arco-design/web-vue'
import { useNoteStore } from '@renderer/store'

const store = useNoteStore()

const currentItem = computed(() => store.getNoteByIndex(store.active, store.activeType))

const handleUpdateTitle = (v) => {
  store.updateNoteById(currentItem.value.id, { title: v })
}

const handleUpdateContent = (v) => {
  store.updateNoteById(currentItem.value.id, { content: v })
}

const handleSave = async () => {
  const { id, title, content, timeStamp } = currentItem.value
  if (!id) return
  await window.electron.ipcRenderer.invoke('save', {
    id,
    title,
    content,
    timeStamp: timeStamp || Date.now()
  })
  Message.success('保存成功')
}

watch(
  () => currentItem.value.id,
  async () => {
    const content = await window.electron.ipcRenderer.invoke(
      'getNoteById',
      toRaw(currentItem.value)
    )
    store.updateNoteById(currentItem.value.id, { content })
  },
  {
    immediate: true
  }
)
</script>

<style lang="less" scoped>
.wrapper {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100vh;
  box-sizing: border-box;

  .title-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;

    .title {
      font-size: 24px;
      font-weight: bold;
      flex: 1;

      &:focus-visible {
        outline: none;
      }
    }

    .title-btns {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      flex: 1;
    }
  }

  .editor {
    flex: 1;
    overflow: hidden;

    :deep(.bytemd) {
      height: 100%;
    }
  }
}
</style>
