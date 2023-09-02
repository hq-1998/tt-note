import path from 'node:path'

const fns = {
  delimiter: path.delimiter,
  basename(_path: string, suffix?: string) {
    return path.basename(_path, suffix)
  },
  join(...paths: string[]) {
    return path.join(...paths)
  },
  win32BaseName(_path: string, suffix?: string) {
    return path.win32.basename(_path, suffix)
  },
  /** 返回path的目录名称 */
  dirname(_path: string) {
    return path.dirname(_path)
  },
  extname(_path: string) {
    return path.extname(_path)
  },
  /** 判断是否是绝对路径 */
  isAbsolute(_path: string) {
    return path.isAbsolute(_path)
  }
}

export default fns
