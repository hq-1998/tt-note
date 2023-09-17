<script lang="tsx" setup>
import { useNoteStore } from '@renderer/store'
import { ref } from 'vue'
import Title from './title.vue'
import Rename from './rename.vue'
import styles from './style.module.less'
import { Message, Modal } from '@arco-design/web-vue'
import BaseEmpty from '@renderer/components/base-empty'
import { ENoteType } from '@renderer/layout/menu/constants'
import { IBaseNote } from '@renderer/store/note'
import MoveModal from './components/move-modal/index.vue'
import SvgComponent from '@renderer/components/svg-component/index.vue'

export type Item = IBaseNote & { index: number }

const oldTitle = ref('')
const modalVisible = ref(false)
const emits = defineEmits(['handleClickListItem', 'handleRename'])
const selectedInfo = ref<Item | null>(null)

const store = useNoteStore()

withDefaults(defineProps<{ data: IBaseNote[] }>(), {
  data: () => []
})
/** 重命名 */
const handleRename = (item: Item) => {
  oldTitle.value = item.title
  emits('handleRename', item)
}

/** 删除 */
const handleDelete = async (item: Item) => {
  Modal.warning({
    title: '确认删除？',
    content: '删除内容将进入回收站，若没有内容将永久删除。',
    alignCenter: false,
    titleAlign: 'start',
    cancelText: '取消',
    hideCancel: false,
    width: 320,
    async onOk() {
      await store.removeNoteById(item.id)
      Message.success('删除成功')
    }
  })
}

/** 移动到 */
const handleMove = (item: Item) => {
  selectedInfo.value = item
  modalVisible.value = true
}

/** 修改名称失焦 */
const handleBlur = async (e, item: Item) => {
  const success = await store.rename(e.target.value, oldTitle.value, item)
  if (success) {
    Message.success('重命名成功')
  }
}

/** 点击列表项 */
const handleClickListItem = (item, index) => {
  store.setActive(index)
  emits('handleClickListItem', {
    ...item,
    index
  })
}

const iconMap = {
  [ENoteType.MARKDOWN]: 'markdown',
  [ENoteType.DIR]: 'directory'
}

const menuConfig = [
  {
    key: 'rename',
    label: '重命名',
    onClick: handleRename
  },
  {
    key: 'move',
    label: '移动到',
    onClick: handleMove
  },
  {
    key: 'delete',
    label: '删除',
    onClick: handleDelete
  }
]
</script>

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
              <div :class="styles['list-inner-wrapper']">
                <SvgComponent :name="iconMap[item.type]" />
                <div v-if="item.isClickRename" :class="styles['list-title-wrapper']">
                  <Rename v-model="item.title" @blur="(e) => handleBlur(e, { ...item, index })" />
                </div>
                <div v-else :class="styles['list-title-wrapper']">
                  <Title :value="item.title" :type="item.type" />
                  <a-popover
                    :content-style="{ padding: '0' }"
                    :arrow-style="{ visibility: 'hidden' }"
                    position="rt"
                  >
                    <template #content>
                      <a-menu style="{ width: '100px', borderRadius: '4px' }">
                        <a-menu-item
                          v-for="menu in menuConfig"
                          :key="menu.key"
                          @click="menu.onClick({ ...item, index })"
                        >
                          {{ menu.label }}
                        </a-menu-item>
                      </a-menu>
                    </template>
                    <icon-more v-if="!item.isClickRename" :class="styles['icon-more']" />
                  </a-popover>
                </div>
              </div>
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
