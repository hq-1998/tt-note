import { ProgressInfo, autoUpdater } from 'electron-updater'
import { app } from 'electron'
import path from 'node:path'
import { windows } from '../window/createWindow'

class AppUpdater {
  initUpdater() {
    /** 取消自动下载 */
    autoUpdater.autoDownload = false
    autoUpdater.autoRunAppAfterInstall = false
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
      url: 'https://hq-cll-1259560137.cos.ap-nanjing.myqcloud.com/dist'
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
  handleUpdateNotAvailable(res) {
    console.log(`没有可用于更新的版本：${res}`)
  }
  /** 下载进度 */
  handleDownloadProgress(res: ProgressInfo) {
    console.log('下载监听：' + res)
    const mainWindow = windows.get('index')
    if (mainWindow) {
      mainWindow.webContents.send('downloadProgress', res)
    }
  }
  /** 下载完成 */
  handleUploadDownload() {
    console.log('下载完成')
  }
  /** 更新出错 */
  handleError() {
    console.log('更新错误')
  }
}

export default new AppUpdater()
