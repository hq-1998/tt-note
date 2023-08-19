const events: {
  [key: string]: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
} = {
  mainHandleTest: (event) => {
    return 'mainHandleTest'
  }
}

export default events
