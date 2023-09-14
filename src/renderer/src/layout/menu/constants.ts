import { v4 } from 'uuid'

export enum ENoteType {
  MARKDOWN = 'md',
  DIR = 'dir'
}

const BASE_PAYLOAD = {
  id: v4(),
  title: '',
  content: '',
  children: []
}

console.log(ENoteType, 'ENoteType')
const PAYLOAD = {
  [ENoteType.MARKDOWN]: {
    type: ENoteType.MARKDOWN as ENoteType,
    isClickRename: false,
    suffix: `.${ENoteType.MARKDOWN}`,
    ...BASE_PAYLOAD
  },
  [ENoteType.DIR]: {
    type: ENoteType.DIR as ENoteType,
    isClickRename: false,
    suffix: '',
    ...BASE_PAYLOAD
  }
}

export default PAYLOAD
