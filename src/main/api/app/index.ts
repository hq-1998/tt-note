import { app } from 'electron'

const fns = {
  /** 获取package.json name */
  getName() {
    return app.name
  },
  setName(_event, name: string) {
    app.setName(name)
  },
  isPackaged() {
    return app.isPackaged
  },
  /** electron是否已经初始化完成 */
  isReady() {
    return app.isReady()
  },
  /** 获取应用程序目录 */
  getAppPath() {
    return app.getAppPath()
  },
  /** 获取系统路径 */
  getPath(
    _event,
    name:
      | 'home'
      /** windows %appdata% */
      /** linux ~/.config $XDG_CONFIG_HOME */
      /** macOS ~/Library/Application Support */
      | 'appData'
      | 'userData'
      | 'sessionData'
      | 'temp'
      | 'exe'
      | 'module'
      | 'desktop'
      | 'documents'
      | 'downloads'
      | 'music'
      | 'pictures'
      | 'videos'
      | 'recent'
      | 'logs'
      | 'crashDumps'
  ) {
    return app.getPath(name)
  },
  /** 获取Package.json版本 */
  getVersion() {
    return app.getVersion()
  }
}

export default fns
