<template>
  <svg
    class="svg-icon"
    aria-hidden="true"
    :style="{
      width: size + 'px',
      height: size + 'px'
    }"
  >
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SvgComponent'
})

withDefaults(
  defineProps<{
    name: string
    size?: number
    color?: string
  }>(),
  {
    size: 16,
    color: '#000'
  }
)
</script>

<style lang="less" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
  cursor: pointer;
}
</style>
