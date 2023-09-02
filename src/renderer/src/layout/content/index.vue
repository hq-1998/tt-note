<template>
  <div class="wrapper">
    <div class="title-wrapper">
      <DivEditable :value="currentItem.title" @update:value="handleUpdateTitle" />
      <div class="title-btns">
        <a-button size="medium" type="outline" status="success" @click="handleSave">保存</a-button>
        <a-button size="medium" type="outline">分享</a-button>
      </div>
    </div>
    <div class="editor">
      <Editor :value="currentItem.content" @update:value="handleUpdateContent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, computed } from 'vue'
import DivEditable from '@renderer/components/editor-element/index.vue'
import { Message } from '@arco-design/web-vue'
import { useNoteStore } from '@renderer/store'

const store = useNoteStore()

const currentItem = computed(() => {
  const item = store.getNoteByIndex(store.active)
  return {
    ...item,
    title: item.title || '无标题笔记'
  }
})

const stop = watch(
  () => currentItem,
  async (item) => {
    if (item) {
      const content = await window.electron.ipcRenderer.invoke('getNoteById', {
        id: item.value.id,
        title: item.value.title,
        timeStamp: item.value.timeStamp
      })
      store.updateNoteById(item.value.id, { content })
      stop()
    }
  },
  {
    deep: true,
    immediate: true
  }
)

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
    id: id,
    title: title,
    content: content,
    timeStamp: timeStamp || Date.now()
  })
  Message.success('保存成功')
}
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

    ::v-deep(.bytemd) {
      height: 100%;
    }
  }
}
</style>
