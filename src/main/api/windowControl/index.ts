import { BrowserWindow } from 'electron'
import { mergeConfig } from '../..'
import ElectronWindow from '../../window/createWindow'
import { WINDOW_OPTIONS } from '../../options/window'

const fns = {
  /** 打开新窗口 */
  openSingleWindow(_event, name: string): void {
    const allWindowNames = global.windowNames
    const isExist = allWindowNames.includes(name)
    let electronWindow = new ElectronWindow(name, mergeConfig(WINDOW_OPTIONS[name]))
    if (electronWindow.window.isDestroyed()) {
      electronWindow = new ElectronWindow(name, mergeConfig(WINDOW_OPTIONS[name]))
    }
    electronWindow[`${isExist ? 'show' : 'open'}`]()
  },
  /** 获取所有窗口 */
  getAllWindows(): BrowserWindow[] {
    return BrowserWindow.getAllWindows()
  },
  /** 关闭当前窗口 */
  closeWindow(): void {
    const currentWindow = BrowserWindow.getFocusedWindow()
    if (currentWindow) {
      currentWindow.close()
    }
  }
}

export default fns
