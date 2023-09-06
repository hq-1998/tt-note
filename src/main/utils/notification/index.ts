import { Notification, nativeImage } from 'electron'
// import icon from '../../../../resources/icon.png?asset'
// const appIcon = nativeImage.createFromPath(icon)

const BASE_OPTIONS = {
  // icon: appIcon
}

class ElectronNotification {
  notification: Notification
  constructor(options?: Electron.NotificationConstructorOptions) {
    if (!this.isSupport) {
      throw new Error('不支持Notification')
    }
    this.notification = new Notification({ ...BASE_OPTIONS, ...options })
  }
  get isSupport() {
    return Notification.isSupported()
  }
  /** 用户显示通知时发出 */
  show() {
    return this.notification.show()
  }
  close() {
    this.notification.close()
  }
  get title() {
    return this.notification.title
  }
  get subtitle() {
    return this.notification.subtitle
  }
  get body() {
    return this.notification.body
  }
}

export default ElectronNotification
