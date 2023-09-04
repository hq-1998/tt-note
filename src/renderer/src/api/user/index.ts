import http from '@renderer/request'
import {
  type IUser,
  type ILoginRes,
  type IVerifyCode,
  type IUserPwd,
  ELoginType,
  IResetPassword
} from './data.d'

const user = {
  /** 登录 */
  login: (params: IUserPwd) => {
    // TODO 优化
    const payload: Record<string, unknown> = {
      type: params.type,
      account: params.account
    }
    payload[params.type === ELoginType.passwordCode ? 'password' : 'code'] = params.password
    return http.post<IUser, ILoginRes>('/users/login', payload as IUser)
  },
  /** 注册 */
  register: (params: IUser) => {
    return http.post('/users/register', {
      account: params.account,
      password: params.password
    })
  },
  /** 发送登录验证码 */
  sendLoginCode: (params: IVerifyCode) => {
    return http.post<IVerifyCode, number>('/users/sendLoginCode', {
      account: params.account
    })
  },
  /** 发送验证码 修改密码 */
  sendResetPasswordCode: (params: IVerifyCode) => {
    return http.post<IVerifyCode, number>('/users/sendResetPasswordCode', {
      account: params.account
    })
  },
  /** 忘记密码 */
  resetPassword: (params: IResetPassword) => {
    return http.post<IResetPassword>('/users/resetPassword', {
      account: params.account,
      newPassword: params.newPassword,
      code: params.code
    })
  }
}

export default user
