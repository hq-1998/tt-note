import { FunctionalComponent, h } from 'vue'

export interface IOption {
  label: string
  key: string
  icon: JSX.Element
}

interface IProps {
  options: IOption[]
  trigger?: 'hover' | 'click'
  position?: 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br'
  class?: string
}

const BaseMore: FunctionalComponent<IProps> = (props, { emit }) => {
  const { class: className = '', options = [], trigger = 'hover', position = 'br' } = props

  const handleClick = (item: IOption) => {
    emit('handle-click', item)
  }

  const slots = {
    content: () => {
      return options.map((item) => {
        return (
          <a-doption
            v-slots={{
              icon: () => h(item.icon)
            }}
            onClick={() => handleClick(item)}
            key={item.key}
            trigger={trigger}
          >
            {item.label}
          </a-doption>
        )
      })
    }
  }
  return (
    <div class={className}>
      <a-dropdown v-slots={slots} position={position}>
        <icon-more />
      </a-dropdown>
    </div>
  )
}

export default BaseMore
