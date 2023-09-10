import http from '@renderer/request'
import { AxiosRequestConfig } from 'axios'

const useRequest = (config: AxiosRequestConfig) => {
  return http.instance.request(config)
}

export default useRequest
