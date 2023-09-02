import { BrowserWindow, OpenDialogSyncOptions, dialog } from 'electron'

const fns = {
  /** 打开dialog */
  showOpenDialogSync(
    _event,
    data: {
      browserWindow: BrowserWindow
      options: OpenDialogSyncOptions
    }
  ) {
    const { browserWindow, options } = data
    const res = dialog.showOpenDialogSync(browserWindow, options)
    return res
  }
}

export default fns
