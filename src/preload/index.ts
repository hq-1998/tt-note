import { contextBridge } from 'electron'
import * as api from './api'
import { electronAPI, ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    jsBridge: typeof api
    electron: ElectronAPI
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('jsBridge', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.jsBridge = api
}
