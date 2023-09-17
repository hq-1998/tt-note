import { FunctionalComponent } from 'vue'
import styles from './style.module.less'
import SvgComponent from '@renderer/components/svg-component/index.vue'

interface IProps {
  /** 空数据图标 */
  icon?: string
  /** 空数据文案 */
  text?: string
  /** 是否隐藏空数组文案 */
  hidden?: boolean
  /** 空数据图大小 */
  size?: number
}

const BaseEmpty: FunctionalComponent<IProps> = (props, { slots }) => {
  const { icon = 'empty', text = '暂无数据', size = 180, hidden = false } = props

  return (
    <div class={styles['empty-wrapper']}>
      <SvgComponent size={size} name={icon} />
      {!hidden && <span class={styles['empty-text']}>{text}</span>}
      {slots?.extra && slots?.extra()}
    </div>
  )
}

export default BaseEmpty
