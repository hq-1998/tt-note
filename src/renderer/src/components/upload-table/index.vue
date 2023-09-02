<template>
  <Render />
</template>

<script setup lang="tsx">
import { ref, watch } from 'vue'
defineOptions({
  name: 'UploadTable'
})

const columns = [
  {
    title: '文件名',
    dataIndex: 'title'
  },
  {
    title: '文件路径',
    dataIndex: 'path'
  },
  {
    title: '文件大小',
    dataIndex: 'size'
  },
  {
    title: '进度',
    dataIndex: 'progress',
    render: () => {
      return <a-progress percent={0} style={{ width: '80px' }} />
    }
  },
  {
    title: '操作',
    align: 'center',
    render: () => {
      return (
        <a-space>
          <a-button type="text">上传</a-button>
          <a-button type="text" status="danger">
            移除
          </a-button>
        </a-space>
      )
    }
  }
]

const props = withDefaults(
  defineProps<{
    data: string[]
  }>(),
  {
    data: () => []
  }
)

const list = ref([])
watch(
  () => props.data,
  (value) => {
    list.value = value.map((item) => {
      return {
        title: window.jsBridge.node.basename(item),
        path: item,
        size: window.jsBridge.node.statSync(item).size + 'kb',
        progress: null
      }
    })
  }
)

const Render = () => {
  return <a-table columns={columns} data={list.value} />
}
</script>

<style lang="less" scoped></style>
```
