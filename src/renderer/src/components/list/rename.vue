<template>
  <a-input
    ref="inputRef"
    :value="props.value"
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
const emits = defineEmits(['update:value', 'blur'])
const handleInput = (e) => {
  emits('update:value', e)
}
const handleBlur = (e) => {
  emits('blur', e)
}
const props = withDefaults(
  defineProps<{
    value: string
  }>(),
  {
    value: ''
  }
)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style lang="less" scoped>
.input-wrapper {
  width: 120px;
}
</style>
