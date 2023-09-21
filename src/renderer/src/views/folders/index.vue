<script lang="ts" setup>
import { computed, ref } from 'vue'
import List from '@renderer/components/list/index.vue'
import { useNoteStore } from '@renderer/store'
import { IBaseNote } from '@renderer/store/note'
import Content from '@renderer/layout/content/index.vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import BaseEmpty from '@renderer/components/base-empty'
import BaseButton from '@renderer/components/base-button'
import { ENoteType } from '@renderer/layout/menu/constants'
import { Message } from '@arco-design/web-vue'

const route = useRoute()

const store = useNoteStore()

const handleAdd = async () => {
  const parentId = route.params.id as string | undefined
  const success = await store.addNote(ENoteType.MARKDOWN, parentId)
  if (success && parentId) {
    Message.success('新建成功')
    const children = store.findParentById(success)?.children || []
    data.value = children
  }
}

const hasLength = computed(() => {
  if (!store.currentItem) return false
  const currentId = store.currentItem.id
  return store.findParentById(currentId).children.length > 0
})

const handleRename = (item: IBaseNote & { index: number }) => {
  store.dirNotes.forEach((note) => (note.isClickRename = false))
  store.dirNotes[item.index].isClickRename = true
}

const handleDelete = () => {}

const data = ref<IBaseNote[]>(store.dirNotes[0]?.children || [])

onBeforeRouteUpdate((to, from) => {
  if (to.params.id !== from.params.id) {
    const parent = store.findParentById(to.params.id as string)
    if (!parent) {
      const index = store.dirNotes.findIndex((item) => item.id === to.params.id)
      const children = store.dirNotes[index]?.children || []
      data.value = children
    } else {
      data.value = parent.children || []
    }
  }
})
</script>

<template>
  <a-layout-content>
    <div class="main-content">
      <List :data="data" @handle-rename="handleRename" @handle-delete="handleDelete" />
      <div class="content">
        <BaseEmpty v-if="!hasLength">
          <template #extra>
            <BaseButton class="add-note" :create="true" @click="handleAdd">新建笔记</BaseButton>
          </template>
        </BaseEmpty>
        <Content v-else :data="store.currentItem!" />
      </div>
    </div>
  </a-layout-content>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
