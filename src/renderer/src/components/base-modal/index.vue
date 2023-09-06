<script setup lang="tsx">
import { useAttrs, VNode, CSSProperties } from 'vue'
import { Modal } from '@arco-design/web-vue'

const slots = defineSlots<{
  title: () => VNode
  footer: () => VNode
  default: () => VNode
}>()

const attrs = useAttrs()

enum ModalSize {
  NORMAL = 560
}

interface IProps {
  class?: string
  style?: CSSProperties
}

type ModalProps = Omit<InstanceType<typeof Modal>['$props'], 'width'> & { width?: ModalSize }

const emit = defineEmits(['update:visible', 'handleClose'])

const Render = (props: IProps & ModalProps) => {
  const {
    visible,
    titleAlign = 'start',
    unmountOnClose = true,
    width = ModalSize.NORMAL,
    class: _class,
    style: _style,
    ...rest
  } = props
  const { title: titleSlot, footer: footerSlot, default: defaultSlot } = slots
  return (
    <Modal
      v-model:visible={visible}
      titleAlign={titleAlign}
      unmountOnClose={unmountOnClose}
      width={width}
      class={_class}
      style={_style}
      footer={false}
      onCancel={() => {
        emit('handleClose')
        emit('update:visible')
      }}
      v-slots={{
        title: () => titleSlot?.(),
        footer: () => footerSlot?.()
      }}
      {...rest}
      {...attrs}
    >
      {defaultSlot?.()}
    </Modal>
  )
}
</script>

<template>
  <Render />
</template>
