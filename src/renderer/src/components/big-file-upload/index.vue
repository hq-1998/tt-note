<template>
  <Upload
    :action="action"
    :auto-upload="false"
    :show-file-list="false"
    :headers="uploadHeaders"
    @before-upload="onBeforeUpload"
    @change="onFileChange"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Upload, FileItem } from '@arco-design/web-vue'
import { generateChunks, mergeChunks, uploadChunks } from './tools'
import { useUserStore } from '@renderer/store'

export default defineComponent({
  name: 'BigFileUpload',
  components: {
    Upload
  },
  setup() {
    const store = useUserStore()
    const action = `${import.meta.env.RENDERER_VITE_API}/upload/bigFile`
    const uploadFile = ref<File>()
    const uploadHeaders = computed(() => {
      return {
        token: store.token
      }
    })

    const onBeforeUpload = () => {
      return true
    }

    const onFileChange = (fileList: FileItem[]) => {
      uploadFile.value = fileList[0].file
      handleSubmit()
    }

    const handleSubmit = () => {
      console.log(uploadFile.value, 'handleSubmit')
      const chunks = generateChunks(uploadFile.value!, 5 * 1024 * 1024)
      import('./worker?worker').then((md5Worker) => {
        const worker = new md5Worker.default()
        worker.postMessage(chunks)
        worker.addEventListener('error', console.error)
        worker.addEventListener('message', async (e) => {
          const md5 = e.data
          const result = await uploadChunks(chunks, md5, uploadFile.value?.name)
          const isSuccess = result.every((item) => item.status === 'fulfilled')
          if (isSuccess) {
            const mergeSuccess = await mergeChunks(md5, uploadFile.value!)
            console.log(mergeSuccess, 'mergeSuccess')
            worker.terminate()
          }
        })
      })
    }

    return {
      action,
      onBeforeUpload,
      onFileChange,
      uploadHeaders
    }
  }
})
</script>

<style lang="less" scoped></style>
