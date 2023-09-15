import { FunctionalComponent } from 'vue'
import { loadSvg } from '@renderer/utils'
import styles from './style.module.less'

interface IProps {
  /** 空数据图标 */
  emptyIconStr?: string
  /** 空数据文案 */
  emptyText?: string
}

const BaseEmpty: FunctionalComponent<IProps> = (props, { slots }) => {
  const { emptyIconStr = 'empty', emptyText = '暂无数据' } = props
  const icon = loadSvg(emptyIconStr)

  return (
    <div class={styles['empty-wrapper']}>
      <img class={styles['empty-icon']} src={icon} />
      <span class={styles['empty-text']}>{emptyText}</span>
      {slots?.extra && slots?.extra()}
    </div>
  )
}

export default BaseEmpty
