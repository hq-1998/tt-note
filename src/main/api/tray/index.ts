import electronTray from '../../utils/tray'

const fns = {
  /** 设置tray url */
  setTrayUrl(_event, options) {
    const url = options.url
    electronTray.setTrayUrl(url)
  }
}

export default fns
