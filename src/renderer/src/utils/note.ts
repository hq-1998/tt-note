/** nodejs获取到的数据格式为 */
/** { file: [], dir: []} */

/** 前台展示 进行整理 归类 细分出文件类型 */
/** { md: [], ...: [], dir: [] } */
const generateNote = async () => {
  const _notes = await window.electron.ipcRenderer.invoke('getNotes')
  console.log(_notes, '===notes===')
  const notes = Object.entries(_notes).reduce((pre, cur) => {
    const [key, value] = cur
    if (!pre[key]) pre[key] = []
    pre[key] = (value as string[]).map((item) => {
      const [id, title, suffix] = item.split('__')
      return {
        id,
        title,
        content: '',
        suffix
      }
    })

    return pre
  }, {})

  const files = notes['file']
  const formatterFiles = files.reduce((pre, cur) => {
    const { suffix } = cur
    if (!pre[suffix]) pre[suffix] = []
    pre[suffix].push(cur)
    return pre
  }, {})

  return {
    ...formatterFiles,
    dir: notes['dir']
  }
}

export { generateNote }
