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
    setUserInfo(userInfo: IUser) {
      this.userInfo = userInfo
    }
  }
})

export default useUserStore
