import fs from './fs'
import path from './path'
import download from './download'

const fns = {
  ...fs,
  ...path,
  ...download
}

export default fns
