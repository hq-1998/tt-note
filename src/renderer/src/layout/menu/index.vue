<template>
  <div class="menu-wrapper">
    <div class="top-wrapper">
      <div class="avatar-wrapper">
        <a-avatar :size="collapsed ? 32 : 64">A</a-avatar>
      </div>
      <div class="menu-list-wrapper">
        <a-menu
          v-model:collapsed="collapsed"
          show-collapse-button
          :style="{ width: '200px', height: '100%' }"
          :default-open-keys="['0']"
          @collapse="onCollapse"
        >
          <a-menu-item key="0">
            <template #icon><icon-apps></icon-apps></template>
            最新
          </a-menu-item>
          <a-sub-menu key="1">
            <template #icon><icon-file /></template>
            <template #title>我的文件夹</template>
            <a-menu-item key="1_0">文件夹-1</a-menu-item>
            <a-menu-item key="1_1">文件夹-2</a-menu-item>
            <a-menu-item key="1_2">文件夹-3</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="2">
            <template #icon><icon-delete></icon-delete></template>
            回收站
          </a-menu-item>
        </a-menu>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const emits = defineEmits(['handleCollapse'])
const collapsed = ref(true)

const onCollapse = (val) => {
  collapsed.value = val
  emits('handleCollapse', val)
}
</script>

<style lang="less" scoped>
.menu-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 15px 3px 0px 3px;
  box-sizing: border-box;
  height: 100%;

  .top-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    .avatar-wrapper {
      margin-bottom: 30px;
    }
    .menu-list-wrapper {
      flex: 1;
    }
  }
}
</style>
