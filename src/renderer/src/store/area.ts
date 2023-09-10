import type { ICity, IProvince } from '@renderer/api/area/data'
import { defineStore } from 'pinia'

const useAreaStore = defineStore('area', {
  state: () => {
    return {
      province: [] as IProvince[],
      city: [] as ICity[],
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
