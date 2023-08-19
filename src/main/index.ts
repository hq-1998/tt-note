import { app, BrowserWindow, globalShortcut, Menu } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import ElectronWindow from './window/createWindow'
import { INDEX, SETTING, WINDOW_OPTIONS } from './options/window'
import { utils } from './window/utils'
import IpcMain from './ipcMain'
import { template } from './menu'
import { join } from 'path'

const webPreferences = {
  preload: join(__dirname, '../preload/index.js'),
  sandbox: false
}

const mergeConfig = (config) => {
  return {
    ...config,
    webPreferences
  }
}

function createWindow(): void {
  const mainWindow = new ElectronWindow(INDEX, mergeConfig(WINDOW_OPTIONS[INDEX]))
  let setting = new ElectronWindow(SETTING, mergeConfig(WINDOW_OPTIONS[SETTING]))

  globalShortcut.register('CommandOrControl+T', () => {
    const allWindowNames = utils.getAllWindowNames()
    const isExist = allWindowNames.includes(SETTING)
    if (setting.window.isDestroyed()) {
      setting = new ElectronWindow(SETTING, mergeConfig(WINDOW_OPTIONS[SETTING]))
    }
    setting[`${isExist ? 'show' : 'open'}`]()
  })

  IpcMain.listen()
  const menuTemplate = Menu.buildFromTemplate(template(mainWindow.window))
  Menu.setApplicationMenu(menuTemplate)
  mainWindow.open()
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
