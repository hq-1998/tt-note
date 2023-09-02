import { IpcMainEvent } from 'electron'

const events: {
  [key: string]: (event: IpcMainEvent, ...args: any[]) => void
} = {
  mainTest: (_event, data) => {
    console.log('mainTest', data)
  }
}

export default events
