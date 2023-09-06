<template>
  <div class="sider-wrapper">
    <div class="left-wrapper">
      <Menu @handle-collapse="handleCollapse" />
    </div>
    <div class="right-wrapper">
      <List />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Menu from '../menu/index.vue'
import List from '../list/index.vue'

const emits = defineEmits(['handleCollapse'])
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
    border-right: 1px solid rgb(229, 230, 235);
    background-color: #f8f9fa;
  }
}
</style>
