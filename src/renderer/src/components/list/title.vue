<template>
  <span>{{ props.value || defaultValue }}</span>
</template>

<script setup lang="ts">
import { ENoteType } from '@renderer/layout/menu/constants'
import { computed } from 'vue'

defineOptions({
  name: 'TitleComp'
})

const defaultValue = computed(() => {
  return (
    {
      [ENoteType.MARKDOWN]: '无标题笔记',
      [ENoteType.DIR]: '新建文件夹'
    }?.[props.type] || '无标题笔记'
  )
})

const props = withDefaults(
  defineProps<{
    value: string
    type: ENoteType
  }>(),
  {
    value: '',
    type: ENoteType.MARKDOWN
  }
)
</script>

<style lang="less" scoped></style>
