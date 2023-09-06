import electronTray from '../../utils/tray'

const fns = {
  /** 设置tray url */
  setTrayUrl(_event, options) {
    const url = options.url
    console.log(url, 'setTray')
    electronTray.setTrayUrl(url)
  }
}

export default fns
