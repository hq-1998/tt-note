<script setup lang="tsx">
import { useAttrs, useSlots, CSSProperties } from 'vue'
import { Modal } from '@arco-design/web-vue'

const slots = useSlots()
const attrs = useAttrs()

enum ModalSize {
  NORMAL = 560
}

interface IProps {
  class?: string
  style?: CSSProperties
}

type ModalProps = Omit<InstanceType<typeof Modal>['$props'], 'width'> & { width?: ModalSize }

const emit = defineEmits(['update:visible'])

const Render = (props: IProps & ModalProps) => {
  const {
    visible,
    titleAlign = 'start',
    width = ModalSize.NORMAL,
    class: _class,
    style: _style,
    ...rest
  } = props
  const { title: titleSlot, footer: footerSlot, default: defaultSlot } = slots
  return (
    <Modal
      v-modal:visible={visible}
      titleAlign={titleAlign}
      width={width}
      class={_class}
      style={_style}
      footer={false}
      onCancel={() => emit('update:visible')}
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
