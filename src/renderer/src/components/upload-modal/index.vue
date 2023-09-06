<script lang="tsx" setup>
import { ref } from 'vue'
import BaseModal from '@renderer/components/base-modal/index.vue'

defineOptions({
  name: 'UploadModal'
})

const props = defineProps({
  modalVisible: {
    type: Boolean,
    default: false
  }
})

const visible = ref(props.modalVisible)
const toggleModalVisible = () => {
  visible.value = !visible.value
  console.log(visible.value, 'value')
}

defineExpose({
  toggleModalVisible
})

const newVersions = ['增加版本提醒功能', '更好地支持苹果/Android手机操作系统', '修复已知问题']
</script>

<template>
  <BaseModal v-model:visible="visible" width="400px">
    <div>123</div>
  </BaseModal>
</template>
