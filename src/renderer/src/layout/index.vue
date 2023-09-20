<script setup lang="ts">
import { computed, ref } from 'vue'
import Sider from '@renderer/layout/sider/index.vue'

const collapse = ref(true)

const handleCollapse = (e) => (collapse.value = e)

const width = computed(() => (collapse.value ? 48 : 200))
</script>

<template>
  <a-layout class="layout">
    <a-layout>
      <a-layout-sider breakpoint="lg" :width="width">
        <Sider @handle-collapse="handleCollapse"> </Sider>
      </a-layout-sider>
      <RouterView />
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
