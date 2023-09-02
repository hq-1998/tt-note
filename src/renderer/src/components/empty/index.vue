<template>
  <div class="empty-wrapper">
    <a-empty>
      <template #image>
        <icon-exclamation-circle-fill />
      </template>
      <div class="empty-text">暂无笔记，快去写一篇吧</div>
      <slot name="extra"></slot>
    </a-empty>
  </div>
</template>

<script setup lang="ts">
import { IconExclamationCircleFill } from '@arco-design/web-vue/es/icon'
</script>

<style lang="less" scoped>
.empty-wrapper {
  height: 100%;
  display: flex;
  align-items: center;

  .empty-text {
    margin-bottom: 12px;
  }
}
</style>
