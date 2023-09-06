import { app, BrowserWindow, globalShortcut, Menu } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import ElectronWindow from './window/createWindow'
import { INDEX, LOGIN, SETTING, WINDOW_OPTIONS } from './options/window'
import { utils } from './window/utils'
import IpcMain from './ipcMain'
import { join } from 'path'
import store from './store'
import electronTray from './utils/tray'

const webPreferences = {
  preload: join(__dirname, '../preload/index.js'),
  nodeIntegrationInWorker: true,
  sandbox: false
}

export const mergeConfig = (config) => {
  return {
    ...config,
    webPreferences
  }
}

/** 获取单实例锁 */
const lock = app.requestSingleInstanceLock()
if (!lock) {
  /** 获取不到单实例锁 标识应用程序已经打开 */
  app.quit()
} else {
  /** 获取到单实例锁的情况下，创建新窗口 */
  app.on('second-instance', () => {
    console.log('second-instance')
    const win = utils.getAllWindows()?.at(0)
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

function createWindow(): void {
  const mainWindow = new ElectronWindow(LOGIN, mergeConfig(WINDOW_OPTIONS[LOGIN]))
  let setting = new ElectronWindow(SETTING, mergeConfig(WINDOW_OPTIONS[SETTING]))

  globalShortcut.register('CommandOrControl+T', () => {
    const allWindowNames = utils.getAllWindowNames()
    const isExist = allWindowNames.includes(SETTING)
    if (setting.window.isDestroyed()) {
      setting = new ElectronWindow(SETTING, mergeConfig(WINDOW_OPTIONS[SETTING]))
    }
    setting[`${isExist ? 'show' : 'open'}`]()
  })

  global.store = store
  IpcMain.listen()
  // const menuTemplate = Menu.buildFromTemplate(template(mainWindow.window))
  Menu.setApplicationMenu(null)
  mainWindow.open()
}

app.whenReady().then(() => {
  app.commandLine.appendSwitch('proxy-server', 'https://registry.npmjs.org/')
  electronApp.setAppUserModelId('com.electron')
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

  electronTray.initTray()

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
