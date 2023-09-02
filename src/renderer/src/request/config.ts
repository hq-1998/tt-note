import { AxiosRequestConfig } from 'axios'

const baseConfig: AxiosRequestConfig = {
  timeout: 30 * 1000,
  baseURL: `${import.meta.env.RENDERER_VITE_API}`,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

export { baseConfig }
