import type { IOption } from '@renderer/components/base-more'
import trash from '@renderer/assets/images/icons/trash.png'
import { menuKey } from '@renderer/router/menuKey'
import SvgComponent from '@renderer/components/svg-component/index.vue'

export enum ENoteType {
  MARKDOWN = 'md',
  DIR = 'dir'
}

const BASE_PAYLOAD = {
  title: '',
  content: '',
  children: []
}

const PAYLOAD = {
  [ENoteType.MARKDOWN]: {
    type: ENoteType.MARKDOWN as ENoteType,
    isClickRename: false,
    ext: `.${ENoteType.MARKDOWN}`,
    ...BASE_PAYLOAD
  },
  [ENoteType.DIR]: {
    type: ENoteType.DIR as ENoteType,
    isClickRename: false,
    ext: '',
    ...BASE_PAYLOAD
  }
}

const OPTION_KEY = {
  MARKDOWN: ENoteType.MARKDOWN,
  DIR: ENoteType.DIR,
  DELETE: 'delete'
}

const createDoptionOptions: IOption[] = [
  {
    label: 'MarkDown',
    key: OPTION_KEY.MARKDOWN,
    icon: <SvgComponent name="markdown" />
  },
  {
    label: '新建文件夹',
    key: OPTION_KEY.DIR,
    icon: <SvgComponent name="directory" />
  }
]

const fileDoptionOptions: IOption[] = [
  ...createDoptionOptions,
  {
    label: '删除',
    key: OPTION_KEY.DELETE,
    icon: <img width={14} height={14} src={trash} />
  }
]

const keyMap = {
  [menuKey.NEW]: ENoteType.MARKDOWN,
  [menuKey.FOLDERS]: ENoteType.DIR,
  [menuKey.STAR]: ENoteType.DIR,
  [menuKey.TRASH]: ENoteType.DIR
}

export { keyMap, OPTION_KEY, createDoptionOptions, fileDoptionOptions, PAYLOAD }
