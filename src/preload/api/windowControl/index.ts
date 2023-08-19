import { BrowserWindow } from 'electron'

const fns = {
  openSingleWindow(name: string): void {
    const windows = fns.getAllWindows()
    console.log(windows)
  },
  getAllWindows(): BrowserWindow[] {
    return BrowserWindow.getAllWindows()
  }
}

export default fns
