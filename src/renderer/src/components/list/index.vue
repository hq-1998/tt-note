<template>
  <Render />
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

const oldTitle = ref('')
const emits = defineEmits(['handelClickListItem'])

const store = useNoteStore()

type Item = IBaseNote & { index: number }

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

const handelClickListItem = (item, index) => {
  store.setActive(index)
  emits('handelClickListItem', {
    ...item,
    index
  })
}

const Render = () => {
  const ContentSlots = {
    content: (item) => {
      return (
        <a-menu style={{ width: '100px', borderRadius: '4px' }}>
          <a-menu-item key="0" onClick={() => handleRename(item)}>
            重命名
          </a-menu-item>
          <a-menu-item key="1">移动到</a-menu-item>
          <a-menu-item onClick={() => handleDelete(item)} key="delete">
            删除
          </a-menu-item>
        </a-menu>
      )
    }
  }

  const ListRender = () => {
    return (
      <div class={styles['list-wrapper']}>
        {(store.notes[store.activeType] || []).map((item, index) => {
          return (
            <div
              onClick={() => handelClickListItem(item, index)}
              key={item.id}
              class={`${styles['list-wrapper-item']} ${
                index === store.active ? styles.active : ''
              }`}
            >
              <div class={styles['list-top-wrapper']}>
                <div class={styles['list-title-wrapper']}>
                  {item.isClickRename ? (
                    <Rename onBlur={(e) => handleBlur(e, index)} v-model={item.title} />
                  ) : (
                    <Title value={item.title} />
                  )}
                </div>

                <a-popover
                  content-style={{ padding: '0' }}
                  arrow-style={{ visibility: 'hidden' }}
                  position="rt"
                  v-slots={{
                    content: () => ContentSlots.content({ ...item, index })
                  }}
                >
                  <icon-more class={styles['icon-more']} />
                </a-popover>
              </div>
              <div class={styles['list-bottom-wrapper']}>{item.timestamp}</div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div class={styles['wrapper']}>
      <div class={styles['search-wrapper']}>
        <a-input-search placeholder="请输入内容" />
      </div>
      <div class={styles.list}>
        <a-list bordered={false} hoverable>
          {store.notes[store.activeType]?.length ? <ListRender /> : <BaseEmpty />}
        </a-list>
      </div>
    </div>
  )
}
</script>
