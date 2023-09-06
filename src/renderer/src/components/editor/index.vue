<template>
  <Editor class="editor-wrapper" :value="props.value" :plugins="plugins" @change="handleChange" />
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Editor } from '@bytemd/vue-next'
import gfm from '@bytemd/plugin-gfm'

const plugins = [gfm()]

const emit = defineEmits(['update:value'])
const props = withDefaults(
  defineProps<{
    value: string
  }>(),
  {
    value: ''
  }
)

const handleChange = (v) => {
  emit('update:value', v)
}
</script>

<style lang="less" scoped>
.editor-wrapper {
  height: 100%;
}
</style>
