import { app, Menu, Tray, nativeImage } from 'electron'
import icon from '../../../../resources/icon.png?asset'
import { windowControl } from '../../api'
import { LOGIN } from '../../options/window'

const appIcon = nativeImage.createFromPath(icon)

class ElectronTray {
  tray: Tray | null = null
  url = LOGIN
  initTray() {
    this.tray = new Tray(appIcon)
    this.tray.setToolTip('小腾笔记')
    const contextMenu: Electron.MenuItemConstructorOptions[] = [
      {
        label: '打开小腾笔记',
        click: () => {
          this.showMainWindow()
        }
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ]

    this.tray.setContextMenu(Menu.buildFromTemplate(contextMenu))
  }
  setTrayUrl(url: string) {
    this.url = url
  }
  showMainWindow() {
    if (!this.url) {
      console.log('请先设置trayUrl')
      return
    }
    console.log(this.url, '====url====')
    windowControl.openSingleWindow(null, this.url)
  }
}

export default new ElectronTray()
