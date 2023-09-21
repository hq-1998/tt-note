import { nativeImage } from 'electron'
import icon from '../../../resources/icon.png?asset'

export const SETTING = 'setting'
export const INDEX = 'index'
export const LOGIN = 'login'

const appIcon = nativeImage.createFromPath(icon)

const BASE_WINDOW_OPTIONS = {
  show: false,
  resizable: false,
  icon: appIcon,
  alwaysOnTop: true
}

export const WINDOW_OPTIONS = {
  [SETTING]: {
    width: 900,
    height: 670,
    autoHideMenuBar: true,
    ...BASE_WINDOW_OPTIONS
  },
  [INDEX]: {
    width: 1280,
    height: 670,
    ...BASE_WINDOW_OPTIONS,
    alwaysOnTop: false
  },
  [LOGIN]: {
    width: 338,
    height: 414,
    ...BASE_WINDOW_OPTIONS
  }
}
