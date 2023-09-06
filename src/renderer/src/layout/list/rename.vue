<template>
  <a-input
    ref="inputRef"
    :value="value"
    class="input-wrapper"
    @blur="handleBlur"
    @input="handleInput"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
defineOptions({
  name: 'RenameComp'
})

const inputRef = ref<HTMLInputElement | null>(null)
const value = defineModel('value')
const emits = defineEmits(['blur'])
const handleInput = (e) => {
  value.value = e
}
const handleBlur = (e) => {
  emits('blur', e)
}

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style lang="less" scoped>
.input-wrapper {
  width: 120px;
}
</style>
