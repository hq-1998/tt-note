<template>
  <a-drawer
    v-model:visible="props.visible"
    class="drawer-wrapper"
    :width="props.width || 340"
    v-bind="{
      ...props,
      ...attrs
    }"
    :drawer-style="{
      padding: '0px'
    }"
    unmount-on-close
    :mask-closable="false"
    @ok="handleToggleVisible"
    @cancel="handleToggleVisible"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot name="default"></slot>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Drawer } from '@arco-design/web-vue'

type IDrawer = InstanceType<typeof Drawer>['$props']

export default defineComponent({
  name: 'DrawerComponent',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible'],
  setup(props: IDrawer, context) {
    const handleToggleVisible = () => {
      context.emit('update:visible', !props.visible)
    }
    return {
      handleToggleVisible,
      props,
      attrs: context.attrs
    }
  }
})
</script>

<style lang="less" scoped>
.drawer-wrapper {
}
</style>
