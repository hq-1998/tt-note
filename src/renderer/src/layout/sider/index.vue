<template>
  <div class="sider-wrapper">
    <div class="left-wrapper">
      <Menu @handle-collapse="handleCollapse" />
    </div>
    <div class="right-wrapper">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Menu from '../menu/index.vue'

const emits = defineEmits(['handleCollapse', 'handelClickListItem'])
const handleCollapse = (e) => {
  emits('handleCollapse', e)
}
</script>

<style lang="less" scoped>
.sider-wrapper {
  display: flex;
  height: 100%;

  .left-wrapper,
  .right-wrapper {
    height: 100%;
  }

  .left-wrapper {
    background-color: #f8f9fa;
  }
}
</style>
