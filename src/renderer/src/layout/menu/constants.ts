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

export default PAYLOAD
