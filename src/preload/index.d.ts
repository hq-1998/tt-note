import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    Electron_Store_Key: Record<string, any>
    electron: ElectronAPI
    jsBridge: unknown
  }
}
