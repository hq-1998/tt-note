import { shell } from 'electron'

const fns = {
  /** 在文件管理器中显示给定的文件 */
  showItemInFolder(_event, fullPath: string) {
    shell.showItemInFolder(fullPath)
  },
  /** 以桌面的默认方式打开给定文件 */
  openPath(_event, path: string) {
    return shell.openPath(path)
  },
  /** 桌面默认方式打开给定的外部协议URL */
  openExternal(_event, url: string, options?: Electron.OpenExternalOptions) {
    shell.openExternal(url, options)
  },
  /** 路径移到垃圾箱 */
  trashItem(_event, path) {
    shell.trashItem(path)
  },
  /** 播放嘟嘟声 */
  beep() {
    shell.beep()
  },
  /** 创建快捷方式 */
  writeShortcutLink(_event, shortcutPath: string, operation: Electron.ShortcutDetails) {
    shell.writeShortcutLink(shortcutPath, operation)
  },
  /** 解析快捷方式链接 */
  readShortcutLink(_event, shortcutPath: string) {
    shell.readShortcutLink(shortcutPath)
  }
}

export default fns
