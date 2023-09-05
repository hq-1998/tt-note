import Electron from 'electron'
import * as api from '../api'

const events: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
} = {
  ...api.dialog,
  ...api.notification,
  ...api.app,
  ...api.net,
  ...api.shell,
  ...api.note,
  ...api.windowControl,
  ...api.tray
}

export default events
