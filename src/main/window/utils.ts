import { BrowserWindow } from 'electron'

export const utils = {
  getAllWindows(): BrowserWindow[] {
    return BrowserWindow.getAllWindows()
  },
  getAllWindowNames(): string[] {
    return global.windowNames
  },
  getMainWindow(): BrowserWindow | undefined {
    return utils.getAllWindows().at(0)
  }
}
