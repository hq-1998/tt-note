<template>
  <a-list
    class="list-wrapper"
    :virtual-list-props="{
      height: 593
    }"
    :bordered="false"
    :data="list"
  >
    <template #item="{ item, index }">
      <a-list-item :key="index" class="list-wrapper-item">
        <span class="title"><span class="dot" />{{ item.title }}</span>
        <a-list-item-meta :title="item.description" :description="item.time" />
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="tsx" setup>
import { reactive } from 'vue'

defineOptions({
  name: 'VirtualScrollList'
})

const list = reactive(
  Array(100)
    .fill(null)
    .map((_) => {
      return {
        title: '小腾笔记会员每天低至3毛钱！',
        description: `折扣最后1天！低价抢先体验AI工具，文字工作事半功倍！立即抢购>>`,
        time: '2023-09-06'
      }
    })
)
</script>

<style lang="less" scoped>
.list-wrapper {
  .list-wrapper-item {
    &:hover {
      background: #f4f6f7;
    }
    .title {
      display: flex;
      align-items: center;
      color: '#232D47';
      font-size: 14px;

      .dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        margin-right: 4px;
        border-radius: 50%;
        background: #ff6161;
      }
    }
  }

  :deep(.arco-list-item-meta-title) {
    color: #7a8599;
    font-size: 13px;
  }

  :deep(.arco-list-item-meta-description) {
    color: #a9b2c2;
    font-size: 12px;
  }
}
</style>
