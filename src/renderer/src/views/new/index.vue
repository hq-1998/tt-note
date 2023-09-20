<script lang="ts" setup>
import { computed } from 'vue'
import List from '@renderer/components/list/index.vue'
import { useNoteStore } from '@renderer/store'
import { IBaseNote } from '@renderer/store/note'
import Content from '@renderer/layout/content/index.vue'
import { useRoute } from 'vue-router'
import BaseEmpty from '@renderer/components/base-empty'
import { ENoteType } from '@renderer/layout/menu/constants'
import { Message } from '@arco-design/web-vue'
import BaseButton from '@renderer/components/base-button/index'

const route = useRoute()

const store = useNoteStore()

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
  store.setCurrentItem(item)
}

const handleRename = (item: IBaseNote & { index: number }) => {
  store.fileNotes.forEach((note) => (note.isClickRename = false))
  store.fileNotes[item.index].isClickRename = true
}
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
            <BaseButton class="add-note" :create="true" @click="handleAdd">新建笔记</BaseButton>
          </template></BaseEmpty
        >
        <Content v-else :data="store.currentItem || store.fileNotes[0]" />
      </div>
    </div>
  </a-layout-content>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
