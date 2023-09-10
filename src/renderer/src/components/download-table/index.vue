<template>
  <Render />
</template>

<script setup lang="tsx">
import { ref } from 'vue'

defineOptions({
  name: 'DownloadTable'
})

const path = ref('')

const handleDownload = async (record) => {
  const { path: url } = record
  const filePath = await window.electron.ipcRenderer.invoke('getPath', 'appData')
  const downloadPath = window.jsBridge.node.join(filePath, 'Downloader')
  path.value = downloadPath

  // store.subscribe(downloadPath, (value) => {
  //   console.log(value)
  // })
  setTimeout(() => {
    window.jsBridge.node.download(url, downloadPath)
  }, 1000)
}

const columns = [
  {
    title: '文件名',
    dataIndex: 'title'
  },
  {
    title: '下载链接',
    dataIndex: 'path',
    width: 200,
    ellipsis: true,
    render: ({ record }) => {
      return <a-button type="text">{record.path}</a-button>
    }
  },
  {
    title: '进度',
    dataIndex: 'progress',
    render: () => {
      return <a-progress show-text={false} percent={0} style={{ width: '80px' }} />
    }
  },
  {
    title: '操作',
    align: 'center',
    render: ({ record }) => {
      return (
        <a-space>
          <a-button onClick={() => handleDownload(record)} type="text">
            下载
          </a-button>
          <a-button type="text" status="danger">
            移除
          </a-button>
        </a-space>
      )
    }
  }
]

const list = ref([
  {
    title: '网易云音乐',
    path: 'https://d1.music.126.net/dmusic/NeteaseCloudMusic_Music_official_3.0.0.Beta.08.09.201795.64.exe',
    progress: '进度'
  }
])

const Render = () => {
  return <a-table columns={columns} data={list.value} />
}
</script>

<style lang="less" scoped></style>
