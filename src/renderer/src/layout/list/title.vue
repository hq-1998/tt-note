<template>
  <span>{{ props.value || '无标题笔记' }}</span>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TitleComp'
})

const props = withDefaults(
  defineProps<{
    value: string
  }>(),
  {
    value: ''
  }
)
</script>

<style lang="less" scoped></style>
