import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { bindEvent } from './event'

const getDevPath = (path: string): string => `${process.env['ELECTRON_RENDERER_URL']}/${path}.html`
const getStaticPath = (path: string): string => join(__dirname, `../renderer/pages/${path}.html}`)

// 储存窗口对象 key 窗口名称 value electronWindow实例
export const windows = new Map<string, BrowserWindow>()
class ElectronWindow {
  private _window: BrowserWindow
  private _name: string | null
  _options: Electron.BrowserWindowConstructorOptions
  constructor(name: string, options: Electron.BrowserWindowConstructorOptions) {
    this._name = name
    this._options = options
    this._window = new BrowserWindow(options)
    const windowIsExist = windows.get(name)
    if (!windowIsExist) {
      windows.set(name, this._window)
    }
    bindEvent(this)
  }
  get window(): BrowserWindow {
    return this._window
  }
  get name(): string | null {
    return this._name
  }
  set name(name: string | null) {
    this._name = name
  }
  open(): void {
    const isDev = is.dev && process.env['ELECTRON_RENDERER_URL']
    const loadMethod = isDev ? 'loadURL' : 'loadFile'
    const getPath = isDev ? getDevPath : getStaticPath
    if (this._name) {
      this._window[loadMethod](getPath(this._name))
      global.windowNames = global.windowNames || []
      global.windowNames.push(this._name)
    }
  }
  show(): void {
    if (!this._window) {
      throw new Error('window is not defined')
    }
    this._window.show()
  }
}

export default ElectronWindow
