import { BrowserWindow, app } from 'electron'

export const template: (mainWindow: BrowserWindow) => Electron.MenuItemConstructorOptions[] = (
  mainWindow
) => [
  {
    label: '测试',
    submenu: [
      {
        label: '主进程发送消息',
        click: () => {
          mainWindow.webContents.send('test', {
            a: 1,
            b: 2
          })
        }
      },
      {
        label: '重启',
        click: () => {
          app.relaunch()
        }
      }
    ]
  }
]
