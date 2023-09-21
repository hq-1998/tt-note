<template>
  <a-drawer
    v-model:visible="props.visible"
    v-slots="$slots"
    :class="styles['drawer-wrapper']"
    :width="props.width || 340"
    v-bind="{
      ...props,
      ...attrs
    }"
    unmount-on-close
    :mask-closable="false"
    @ok="handleToggleVisible"
    @cancel="handleToggleVisible"
  >
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Drawer } from '@arco-design/web-vue'
import styles from './style.module.less'

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
      attrs: context.attrs,
      styles
    }
  }
})
</script>
