import http from '@renderer/request'

const user = {
  login: (params: IUser) => {
    return http.post<IUser, ILoginRes>('/users/login', {
      account: params.account,
      password: params.password
    })
  },
  register: (params: IUser) => {
    return http.post('/users/register', {
      account: params.account,
      password: params.password
    })
  }
}

export default user
