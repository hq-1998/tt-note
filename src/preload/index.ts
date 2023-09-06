import { contextBridge } from 'electron'
import * as api from './api'
import { electronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    jsBridge: typeof api
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
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.jsBridge = api
}
