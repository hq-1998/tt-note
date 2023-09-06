import ElectronNotification from '../../utils/notification'

const fns = {
  /** 发送notification */
  sendNotification(_event, options?: Electron.NotificationConstructorOptions) {
    const instance = new ElectronNotification(options)
    instance.show()
  }
}

export default fns
