/** nodejs获取到的数据格式为 */
/** { file: [], dir: []} */

/** 前台展示 进行整理 归类 细分出文件类型 */
/** { md: [], ...: [], dir: [] } */
const generateNote = async () => {
  const _notes = await window.electron.ipcRenderer.invoke('getNotes')
  const notes = Object.entries(_notes).reduce((pre, cur) => {
    const [key, value] = cur
    if (!pre[key]) pre[key] = []
    pre[key] = (value as { name: string; mtime: string }[]).map((item) => {
      const { name, mtime } = item
      const [filename, ext] = name.split('.')
      const [id, title] = filename.split('__')
      return {
        id,
        title,
        content: '',
        timestamp: mtime,
        ext: `.${ext}`,
        type: ext
      }
    })

    return pre
  }, {})

  const files = notes['file']
  const formatterFiles = files.reduce((pre, cur) => {
    const { type } = cur
    if (!pre[type]) pre[type] = []
    pre[type].push(cur)
    return pre
  }, {})

  return {
    ...formatterFiles,
    dir: notes['dir']
  }
}

export { generateNote }
