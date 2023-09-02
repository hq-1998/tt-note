import ElectronNotification from '../../utils/notification'

const fns = {
  /** 发送notification */
  getNotificationInstance(_event, options) {
    const instance = new ElectronNotification(options)
    instance.show()
  }
}

export default fns
