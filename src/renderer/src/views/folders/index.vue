<script lang="ts" setup>
import { ref } from 'vue'
import List from '@renderer/components/list/index.vue'
import { useNoteStore } from '@renderer/store'
import { IBaseNote } from '@renderer/store/note'
import Content from '@renderer/layout/content/index.vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import BaseEmpty from '@renderer/components/base-empty'
import { ENoteType } from '@renderer/layout/menu/constants'

const route = useRoute()

const store = useNoteStore()
const currentItem = ref<IBaseNote | null>(null)

const handleAdd = () => {
  const id = route.params.id as string | undefined
  store.addNote(ENoteType.MARKDOWN, id && store.notesMap[id].fullname)
}

const hasLength = ref(!!(store.dirNotes[store.active].children.length || 0))

const handleClickListItem = (item: IBaseNote) => {
  currentItem.value = item
}

const data = ref<IBaseNote[]>([])

onBeforeRouteUpdate((to, from) => {
  if (to.params.id !== from.params.id) {
    const item = store.dirNotes.find((child) => child.id === to.params.id)
    hasLength.value = !!(item?.children.length || 0)
    if (item) {
      data.value = item.children || []
    }
  }
})
</script>

<template>
  <a-layout-content>
    <div class="main-content">
      <List :data="data" @handle-click-list-item="handleClickListItem" />
      <div class="content">
        <BaseEmpty v-if="!hasLength">
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
        <Content v-else :data="currentItem || data[store.active]" />
      </div>
    </div>
  </a-layout-content>
</template>

<style lang="less" scoped>
.main-content {
  display: flex;
  height: 100%;
  .content {
    flex: 1;
    height: 100%;
    border-left: 1px solid #f7f8f9;
  }
}
</style>
