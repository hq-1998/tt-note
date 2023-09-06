import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { baseConfig } from './config'
import { Message } from '@arco-design/web-vue'

type Result<T> = {
  code: number
  message: string
  data: T
}

class Request {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create(baseConfig)

    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(new Error(error))
      }
    )

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        if (res.data.code !== 0) {
          Message.error(res.data.message || res.data)
        }
        console.log(res.data, '+++res+++')
        return res.data
      },
      (error) => {
        Message.error(error?.message || '系统异常，请稍后再试')
        return Promise.reject(new Error(error))
      }
    )
  }
  request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }
  get<U = unknown>(url: string, config?: AxiosRequestConfig): Promise<Result<U>> {
    return this.instance.get(url, config)
  }
  post<T = unknown, U = unknown>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<Result<U>> {
    return this.instance.post(url, data, config)
  }
}

const instance = new Request()

export default instance
