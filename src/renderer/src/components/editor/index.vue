<template>
  <Editor class="editor-wrapper" :value="value" :plugins="plugins" @change="handleChange" />
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Editor } from '@bytemd/vue-next'
import gfm from '@bytemd/plugin-gfm'

const plugins = [gfm()]

const value = defineModel('value')

const handleChange = (v) => {
  value.value = v
}
</script>

<style lang="less" scoped>
.editor-wrapper {
  height: 100%;
}
</style>
