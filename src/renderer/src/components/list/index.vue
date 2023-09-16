<template>
  <div :class="styles['wrapper']">
    <div :class="styles['search-wrapper']">
      <a-input-search placeholder="请输入内容" />
    </div>
    <div :class="styles.list">
      <a-list :bordered="false" hoverable>
        <div v-if="data.length" :class="styles['list-wrapper']">
          <div
            v-for="(item, index) in data"
            :key="item.id"
            :class="`${styles['list-wrapper-item']} ${index === store.active ? styles.active : ''}`"
            @click="handleClickListItem(item, index)"
          >
            <div :class="styles['list-top-wrapper']">
              <div :class="styles['list-title-wrapper']">
                <Rename
                  v-if="item.isClickRename"
                  v-model="item.title"
                  @blur="(e) => handleBlur(e, index)"
                />
                <Title v-else :value="item.title" :type="item.type" />
              </div>
              <a-popover
                :content-style="{ padding: '0' }"
                :arrow-style="{ visibility: 'hidden' }"
                position="rt"
              >
                <template #content>
                  <a-menu style="{ width: '100px', borderRadius: '4px' }">
                    <a-menu-item key="rename" @click="handleRename({ ...item, index })">
                      重命名
                    </a-menu-item>
                    <a-menu-item key="move" @click="handleMove({ ...item, index })">
                      移动到
                    </a-menu-item>
                    <a-menu-item key="delete" @click="handleDelete({ ...item, index })">
                      删除
                    </a-menu-item>
                  </a-menu>
                </template>
                <icon-more :class="styles['icon-more']" />
              </a-popover>
            </div>
            <div :class="styles['list-bottom-wrapper']">{{ item.timestamp }}</div>
          </div>
        </div>
        <BaseEmpty v-else />
      </a-list>
    </div>
    <MoveModal v-model:modalVisible="modalVisible" :data="selectedInfo" />
  </div>
</template>

<script lang="tsx" setup>
import { useNoteStore } from '@renderer/store'
import { ref } from 'vue'
import Title from './title.vue'
import Rename from './rename.vue'
import styles from './style.module.less'
import { Message } from '@arco-design/web-vue'
import BaseEmpty from '@renderer/components/base-empty'
import { ENoteType } from '@renderer/layout/menu/constants'
import { IBaseNote } from '@renderer/store/note'
import MoveModal from './components/move-modal/index.vue'

export type Item = IBaseNote & { index: number }

const oldTitle = ref('')
const modalVisible = ref(false)
const emits = defineEmits(['handleClickListItem'])
const selectedInfo = ref<Item | null>(null)

const store = useNoteStore()

withDefaults(defineProps<{ data: IBaseNote[] }>(), {
  data: () => []
})
/** 重命名 */
const handleRename = (item: Item) => {
  oldTitle.value = item.title
  store.notes[store.activeType]!.forEach((note) => {
    note.isClickRename = false
  })
  store.notes[item.index].isClickRename = true
}

/** 删除 */
const handleDelete = async (item: Item) => {
  await store.removeNote(item)
  Message.success('删除成功')
}

/** 移动到 */
const handleMove = (item: Item) => {
  selectedInfo.value = item
  modalVisible.value = true
}

/** 修改名称失焦 */
const handleBlur = async (e, index: number) => {
  store.notes[index].isClickRename = false
  const item = { ...store.notes[index] }
  const value = e.target.value
  if (Object.is(value, oldTitle.value)) return
  store.updateNoteById(item.id, {
    title: value,
    type: ENoteType.MARKDOWN
  })
  await window.electron.ipcRenderer.invoke('rename', {
    id: item.id,
    title: value
  })
  Message.success('重命名成功')
}

/** 点击列表项 */
const handleClickListItem = (item, index) => {
  store.setActive(index)
  emits('handleClickListItem', {
    ...item,
    index
  })
}
</script>
