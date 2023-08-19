import ElectronWindow from './createWindow'

export const bindEvent = (electronWindow: ElectronWindow): void => {
  electronWindow.window.on('ready-to-show', () => {
    electronWindow.show()
  })
  electronWindow.window.on('closed', () => {
    const findNameIndex = (global.windowNames || []).findIndex(
      (item) => item === electronWindow.name
    )
    if (findNameIndex > -1) {
      global.windowNames.splice(findNameIndex, 1)
    }
    electronWindow.name = null
    electronWindow.window.removeAllListeners()
  })
}
