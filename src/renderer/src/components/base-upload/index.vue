<script setup lang="ts">
import { FileItem } from '@arco-design/web-vue'
import { useUserStore } from '@renderer/store'
import { ref, computed } from 'vue'

defineOptions({
  name: 'BaseUpload'
})

const emits = defineEmits(['success'])

const store = useUserStore()

interface IProps {
  /** 上传文件类型 */
  accept?: string
  /** 上传文件URL */
  action?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否支持多文件上传 */
  multiple?: boolean
  /** 是否支持文件夹上传 */
  directory?: boolean
  /** 请求头附加信息 */
  headers?: Record<string, string>
  /** 上传文件名 */
  name?: string | ((fileItem: FileItem) => string)
  /** 是否自动上传文件 */
  autoUpload?: boolean
  /** 是否显示文件列表 */
  showFileList?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  accept: '.jpg,.jpeg,.png,.gif',
  action: `${import.meta.env.RENDERER_VITE_API}/upload`,
  disabled: false,
  multiply: false,
  directory: false,
  headers: () => ({}),
  name: '',
  autoUpload: true,
  showFileList: false
})

const uploadRef = ref()
const files = ref([])

const onChange = (fileList) => {
  files.value = fileList
}

const onSuccess = (fileItem: FileItem) => {
  emits('success', fileItem.response.data)
}

const uploadHeaders = computed(() => {
  return {
    token: store.token,
    ...(props.headers || {})
  }
})

const handleData = (fileItem: FileItem) => {
  return {
    fileType: fileItem.file.name.split('.')[1],
    userId: store.userInfo.id
  }
}
</script>

<template>
  <a-upload
    v-if="!url"
    ref="uploadRef"
    :accept="accept"
    :action="action"
    :disabled="disabled"
    :multiple="multiple"
    :directory="directory"
    :headers="uploadHeaders"
    :data="handleData"
    :name="name"
    :auto-upload="autoUpload"
    :show-file-list="showFileList"
    @change="onChange"
    @success="onSuccess"
  >
    <template #upload-button>
      <slot name="uploadButton" />
    </template>
  </a-upload>
</template>
