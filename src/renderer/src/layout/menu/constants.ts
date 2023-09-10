import { ENoteType } from '@renderer/store/note'
import { v4 } from 'uuid'

const BASE_PAYLOAD = {
  id: v4(),
  title: '',
  timeStamp: Date.now(),
  content: '',
  children: []
}

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
