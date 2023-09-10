import http from '@renderer/request'
import type { IProvince, ICity } from './data'

const user = {
  /** 获取省份数据 */
  getProvince: () => {
    return http.get<IProvince[]>('/area/getProvince')
  },
  /** 根据省id获取城市数据 */
  getCityByPid: (pid: number) => {
    return http.get<ICity[]>('/area/getCityByPid', { params: { pid } })
  }
}

export default user
