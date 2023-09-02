import http from '@renderer/request'

const user = {
  login: (params: { account: string; password: string }) => {
    return http.instance.post('/users/login', {
      account: params.account,
      password: params.password
    })
  },
  register: (params: { account: string; password: string }) => {
    return http.instance.post('/users/register', {
      account: params.account,
      password: params.password
    })
  }
}

export default user
