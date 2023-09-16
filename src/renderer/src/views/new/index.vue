<script lang="ts" setup>
import { onMounted, computed, ref } from 'vue'
import List from '@renderer/components/list/index.vue'
import { useNoteStore } from '@renderer/store'
import { IBaseNote } from '@renderer/store/note'
import Content from '@renderer/layout/content/index.vue'
import { useRoute } from 'vue-router'
import BaseEmpty from '@renderer/components/base-empty'
import { ENoteType } from '@renderer/layout/menu/constants'

const route = useRoute()

const data = ref<IBaseNote[]>([])
const currentItem = ref<IBaseNote | null>(null)
const store = useNoteStore()

onMounted(() => {
  data.value = store.notes || []
})

const handleAdd = () => {
  const id = route.params.id as string | undefined
  store.addNote(ENoteType.MARKDOWN, id && store.notesMap[id].fullname)
}

const empty = computed(() => {
  if (currentItem.value?.type === ENoteType.DIR) return true
  return store.notes.length === 0
})

const handleClickListItem = (item: IBaseNote) => {
  currentItem.value = item
  console.log(currentItem.value, 'currentItem')
}
</script>

<template>
  <a-layout-content>
    <div class="main-content">
      <List :data="data" @handle-click-list-item="handleClickListItem" />
      <div class="content">
        <BaseEmpty
          v-if="empty"
          :hidden="currentItem?.type === ENoteType.DIR"
          :icon="currentItem?.type === ENoteType.DIR ? 'emptyDir' : undefined"
        >
          <template v-if="currentItem?.type !== ENoteType.DIR" #extra>
            <a-button size="medium" class="add-note" type="primary">
              <template #icon>
                <icon-plus />
              </template>
              <div @click="handleAdd">新建笔记</div>
            </a-button>
          </template></BaseEmpty
        >
        <Content v-else :data="(currentItem as IBaseNote) || store.notes[0]" />
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
