<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import List from '@renderer/components/list/index.vue'
import { useNoteStore } from '@renderer/store'
import { IBaseNote } from '@renderer/store/note'
import Content from '@renderer/layout/content/index.vue'
import { useRoute } from 'vue-router'
import BaseEmpty from '@renderer/components/base-empty'
import { ENoteType } from '@renderer/layout/menu/constants'
import { Message } from '@arco-design/web-vue'

const route = useRoute()

const store = useNoteStore()
const currentItem = ref<IBaseNote | null>(null)

const handleAdd = async () => {
  const parentId = route.params.id as string | undefined
  const success = await store.addNote(ENoteType.MARKDOWN, parentId)
  if (success) {
    Message.success('新建成功')
  }
}

const empty = computed(() => {
  return store.fileNotes.length === 0
})

const handleClickListItem = (item: IBaseNote) => {
  currentItem.value = item
}

const handleRename = (item: IBaseNote & { index: number }) => {
  store.fileNotes.forEach((note) => (note.isClickRename = false))
  store.fileNotes[item.index].isClickRename = true
}

onMounted(async () => {
  const { result, noteMaps } = await window.electron.ipcRenderer.invoke('getNotes')
  store.setNotes(result)
  store.setNotesMap(noteMaps)
})
</script>

<template>
  <a-layout-content>
    <div class="main-content">
      <List
        :data="store.fileNotes"
        @handle-click-list-item="handleClickListItem"
        @handle-rename="handleRename"
      />
      <div class="content">
        <BaseEmpty v-if="empty">
          <template #extra>
            <a-button size="medium" class="add-note" type="primary">
              <template #icon>
                <icon-plus />
              </template>
              <div @click="handleAdd">新建笔记</div>
            </a-button>
          </template></BaseEmpty
        >
        <Content v-else :data="(currentItem as IBaseNote) || store.fileNotes[0]" />
      </div>
    </div>
  </a-layout-content>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
