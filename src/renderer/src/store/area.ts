import type { ICity, IProvince } from '@renderer/api/area/data'
import { defineStore } from 'pinia'

interface IState {
  province: IProvince[]
  city: ICity[]
  selectedProvinceId: number
  selectedCityId: number
}

const useAreaStore = defineStore('area', {
  state: (): IState => {
    return {
      province: [],
      city: [],
      selectedProvinceId: -1,
      selectedCityId: -1
    }
  },
  actions: {
    setProvince(province: IProvince[]) {
      this.province = province
    },
    setCity(city: ICity[]) {
      this.city = city
    },
    setSelectedProvinceId(id: number) {
      this.selectedProvinceId = id
    },
    setSelectedCityId(id: number) {
      this.selectedCityId = id
    }
  }
})

export default useAreaStore
