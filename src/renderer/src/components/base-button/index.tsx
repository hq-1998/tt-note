import { Button } from '@arco-design/web-vue'
import { FunctionalComponent } from 'vue'

type ICustomButtonConfig = {
  create?: boolean
}

export type IMergeButtonConfig = ICustomButtonConfig & InstanceType<typeof Button>['$props']

const BaseButton: FunctionalComponent<IMergeButtonConfig> = (props, { emit, attrs, slots }) => {
  const { size = 'medium', type = 'primary', create = false, ...rest } = props

  const handleClick = () => {
    emit('handle-click')
  }

  const buttonSlots = {
    icon: () => <icon-plus />,
    ...slots
  }
  return (
    <a-button
      size={size}
      class={attrs.class}
      style={attrs.style}
      type={type}
      v-slots={create ? buttonSlots : slots}
      {...rest}
      onClick={handleClick}
    >
      {slots.default?.()}
    </a-button>
  )
}

export default BaseButton
