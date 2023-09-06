import { BrowserWindow } from 'electron'
import { mergeConfig } from '../..'
import ElectronWindow, { windows } from '../../window/createWindow'
import { WINDOW_OPTIONS } from '../../options/window'

const fns = {
  /** 打开新窗口 */
  openSingleWindow(_event, name: string): void {
    const maybeExistWindow = windows.get(name)
    console.log(maybeExistWindow, maybeExistWindow?.isDestroyed(), 'maybeExistWindow')
    if (maybeExistWindow && !maybeExistWindow?.isDestroyed()) {
      maybeExistWindow.show()
    } else {
      const electronWindow = new ElectronWindow(name, mergeConfig(WINDOW_OPTIONS[name]))
      electronWindow.open()
    }
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
