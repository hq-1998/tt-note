import { ProgressInfo, autoUpdater } from 'electron-updater'
import { app } from 'electron'
import path from 'node:path'
import { windows } from '../window/createWindow'

class AppUpdater {
  initUpdater() {
    /** 取消自动下载 */
    autoUpdater.autoDownload = false
    autoUpdater.autoRunAppAfterInstall = false
    if (!app.isPackaged) {
      autoUpdater.updateConfigPath = path.join(process.cwd(), 'dev-app-update.yml')
    }
    autoUpdater.on('update-available', this.handleUpdateAvailable)
    autoUpdater.on('update-not-available', this.handleUpdateNotAvailable)
    autoUpdater.on('download-progress', this.handleDownloadProgress)
    autoUpdater.on('update-downloaded', this.handleUploadDownload)
    autoUpdater.on('error', this.handleError)
  }
  /** 设置更新url */
  private setCheckUrl(url: string) {
    autoUpdater.setFeedURL({
      provider: 'generic',
      url
    })
  }
  /** 比对服务端url下载逻辑 */
  async patchUrlAndDownload(url: string) {
    const dirUrl = path.dirname(url)
    this.setCheckUrl(dirUrl)
    await autoUpdater.checkForUpdates()
    await autoUpdater.downloadUpdate()
  }
  /** 有可用更新 */
  handleUpdateAvailable() {
    console.log(`${app.getVersion()}有可用更新`)
  }
  /** 没有可用于更新的版本 */
  handleUpdateNotAvailable() {
    console.log('not available')
  }
  /** 下载进度 */
  handleDownloadProgress(res: ProgressInfo) {
    console.log(JSON.stringify(res))
    const mainWindow = windows.get('index')
    if (mainWindow) {
      mainWindow.webContents.send('downloadProgress', res)
    }
  }
  /** 下载完成 */
  handleUploadDownload() {
    console.log('downloaded')
  }
  /** 更新出错 */
  handleError() {
    console.log('downloadError')
  }
}

export default new AppUpdater()
