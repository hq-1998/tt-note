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
</script>

<template>
  <BaseModal v-model:visible="visible" width="400px">
    <div>123</div>
  </BaseModal>
</template>
