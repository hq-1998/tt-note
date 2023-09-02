import { BrowserWindow, OpenDialogSyncOptions, dialog } from 'electron'
import Electron from 'electron'
import ElectronNotification from '../utils/notification'
import * as api from '../api'

const events: {
  [key: string]: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
} = {
  mainHandleTest: (_event) => {
    return 'mainHandleTest'
  },
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
  },
  getNotificationInstance(_event, options) {
    const instance = new ElectronNotification(options)
    instance.show()
  },
  ...api.app,
  ...api.net,
  ...api.shell,
  ...api.note
}

export default events
