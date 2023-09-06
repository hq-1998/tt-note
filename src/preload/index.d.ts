import { ElectronAPI } from '@electron-toolkit/preload'
import * as api from './api'

declare global {
  interface Window {
    Electron_Store_Key: Record<string, any>
    electron: ElectronAPI
    jsBridge: typeof api
  }
}
