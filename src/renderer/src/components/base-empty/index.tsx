import { FunctionalComponent } from 'vue'
import { loadSvg } from '@renderer/utils'
import styles from './style.module.less'

interface IProps {
  /** 空数据图标 */
  icon?: string
  /** 空数据文案 */
  text?: string
  /** 是否隐藏空数组文案 */
  hidden?: boolean
}

const BaseEmpty: FunctionalComponent<IProps> = (props, { slots }) => {
  const { icon = 'empty', text = '暂无数据', hidden = false } = props
  const iconAsset = loadSvg(icon)

  return (
    <div class={styles['empty-wrapper']}>
      <img class={styles['empty-icon']} src={iconAsset} />
      {!hidden && <span class={styles['empty-text']}>{text}</span>}
      {slots?.extra && slots?.extra()}
    </div>
  )
}

export default BaseEmpty
