import { BrowserWindow, ipcMain } from 'electron'
import events from './listener'
import handleEvents from './handle'

/** ipcMain */
class IpcMain {
  mainWindow: BrowserWindow
  constructor(window: BrowserWindow) {
    this.mainWindow = window
  }
  removeListener(channel: string, listener: (...args: any[]) => void): void {
    ipcMain.removeListener(channel, listener)
  }
  removeAllListeners(channel?: string): void {
    ipcMain.removeAllListeners(channel)
  }
  removeHandler(channel: string): void {
    ipcMain.removeHandler(channel)
  }
  static listen(): void {
    for (const [channel, listener] of Object.entries(events)) {
      ipcMain.on(channel, listener)
    }
    for (const [channel, listener] of Object.entries(handleEvents)) {
      ipcMain.handle(channel, listener)
    }
  }
  send(channel: string, ...args: any[]): void {
    this.mainWindow.webContents.send(channel, args)
  }
}

export default IpcMain
