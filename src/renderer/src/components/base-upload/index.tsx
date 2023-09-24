import { FileItem, Upload } from '@arco-design/web-vue'
import { useUserStore } from '@renderer/store'
import { FunctionalComponent, ref, computed } from 'vue'

type IProps = InstanceType<typeof Upload>['$props']
type IEmits = { success: (fileItem: FileItem) => void }
type ISlots = InstanceType<typeof Upload>['$slots']

const BaseUpload: FunctionalComponent<IProps, IEmits, ISlots> = (props, { emit, slots }) => {
  const {
    accept = '.jpg,.jpeg,.png,.gif',
    action = `${import.meta.env.RENDERER_VITE_API}/upload`,
    headers = () => ({}),
    autoUpload = true,
    showFileList = false,
    ...rest
  } = props

  const store = useUserStore()
  const uploadRef = ref()
  const files = ref([])

  const onChange = (fileList) => {
    files.value = fileList
  }

  const onSuccess = (fileItem: FileItem) => {
    emit('success', fileItem)
  }

  const uploadHeaders = computed(() => {
    return {
      token: store.token,
      ...(headers || {})
    }
  })

  const handleData = (fileItem: FileItem) => {
    return {
      fileType: fileItem.file!.name.split('.')[1],
      userId: String(store.userInfo.id)
    }
  }

  return (
    <a-upload
      ref={uploadRef.value}
      v-slots={slots}
      accept={accept}
      action={action}
      headers={uploadHeaders.value}
      data={handleData}
      auto-upload={autoUpload}
      show-file-list={showFileList}
      {...rest}
      onChange={onChange}
      onSuccess={onSuccess}
    />
  )
}

export default BaseUpload
