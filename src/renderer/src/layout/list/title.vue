<template>
  <span>{{ props.value }}</span>
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
    value: '无标题笔记'
  }
)
</script>

<style lang="less" scoped></style>
