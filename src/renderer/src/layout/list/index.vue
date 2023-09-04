<template>
  <Render />
</template>

<script lang="tsx" setup>
import { useNoteStore } from '@renderer/store'
import { ref } from 'vue'
import Title from './title.vue'
import Rename from './rename.vue'
import dayjs from 'dayjs'
import styles from './style.module.less'
import { Message } from '@arco-design/web-vue'

const store = useNoteStore()
const oldTitle = ref('')
const handleRename = (index: number, title: string) => {
  oldTitle.value = title
  store.notes.forEach((note) => {
    note.isClickRename = false
  })
  store.notes[index].isClickRename = true
}

// getNotes() {
//       return this.notes.sort((a, b) => b.timeStamp! - a.timeStamp!)
//     }

const handleBlur = async (e, index: number) => {
  store.notes[index].isClickRename = false
  const item = { ...store.notes[index] }
  const value = e.target.value
  if (Object.is(value, oldTitle.value)) return
  store.updateNoteById(item.id, {
    title: value
  })
  await window.electron.ipcRenderer.invoke('rename', {
    id: item.id,
    title: value,
    timeStamp: Date.now()
  })
  Message.success('重命名成功')
}

const Render = () => {
  const ContentSlots = {
    content: (index: number, title: string) => {
      return (
        <a-menu style={{ width: '100px', borderRadius: '4px' }}>
          <a-menu-item key="0" onClick={() => handleRename(index, title)}>
            重命名
          </a-menu-item>
          <a-menu-item key="1">移动到</a-menu-item>
          <a-menu-item key="2">删除</a-menu-item>
        </a-menu>
      )
    }
  }

  return (
    <div class={styles['wrapper']}>
      <div class={styles['search-wrapper']}>
        <a-input-search placeholder="请输入内容" />
      </div>
      <div class={styles.list}>
        <a-list bordered={false} hoverable>
          <div class={styles['list-wrapper']}>
            {store.notes.map((item, index) => {
              return (
                <div key={item.id} class={styles['list-wrapper-item']}>
                  <div class={styles['list-top-wrapper']}>
                    {item.isClickRename ? (
                      <Rename onBlur={(e) => handleBlur(e, index)} v-model={item.title} />
                    ) : (
                      <Title value={item.title} />
                    )}
                    <a-popover
                      content-style={{ padding: '0' }}
                      arrow-style={{ visibility: 'hidden' }}
                      position="rt"
                      v-slots={{
                        content: ContentSlots.content(index, item.title)
                      }}
                    >
                      <icon-more class={styles['icon-more']} />
                    </a-popover>
                  </div>
                  <div class={styles['list-bottom-wrapper']}>{dayjs().format('YYYY-MM-DD')}</div>
                </div>
              )
            })}
          </div>
        </a-list>
      </div>
    </div>
  )
}
</script>
