import { IUserInfo } from '@renderer/api/user/data'
import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '',
      userInfo: {}
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo: IUserInfo) {
      this.userInfo = userInfo
    }
  }
})

export default useUserStore
