<template>
  <div class="sider-wrapper">
    <Menu @handle-collapse="handleCollapse" />
  </div>
</template>

<script lang="ts" setup>
import Menu from '../menu/index.vue'

const emits = defineEmits(['handleCollapse'])

const handleCollapse = (e) => {
  emits('handleCollapse', e)
}
</script>

<style lang="less" scoped>
.sider-wrapper {
  height: 100%;
  display: inline-flex;
  background-color: #f8f9fa;
}
</style>
