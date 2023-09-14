import { FunctionalComponent, h } from 'vue'

export interface IOption {
  label: string
  value: string
  icon: JSX.Element
  click: () => void
}

interface IProps {
  options: IOption[]
  trigger?: 'hover' | 'click'
  position?: 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br'
  class?: string
}

const BaseMore: FunctionalComponent<IProps> = (props) => {
  const { class: className = '', options = [], trigger = 'hover', position = 'br' } = props

  const slots = {
    content: () => {
      return options.map((item) => {
        return (
          <a-doption
            v-slots={{
              icon: () => h(item.icon)
            }}
            key={item.value}
            trigger={trigger}
            onClick={item.click}
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
