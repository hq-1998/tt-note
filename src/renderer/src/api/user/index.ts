import http from '@renderer/request'
import {
  type IUser,
  type ILoginRes,
  type IVerifyCode,
  type IUserPwd,
  ELoginType,
  IResetPassword,
  IUserInfo
} from './data.d'

const user = {
  /** 登录 */
  // TODO 优化
  login: (params: IUserPwd) => {
    const payload: Record<string, unknown> = {
      type: params.type,
      account: params.account
    }
    payload[params.type === ELoginType.passwordCode ? 'password' : 'code'] = params.password
    return http.post<IUser, ILoginRes>('/users/login', payload as IUser)
  },
  /** 注册 */
  register: (params: IUserPwd) => {
    const payload: Record<string, unknown> = {
      type: params.type,
      account: params.account
    }
    payload[params.type === ELoginType.passwordCode ? 'password' : 'code'] = params.password
    return http.post<IUser, ILoginRes>('/users/register', payload as IUser)
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
  },
  /** 获取个人信息 */
  getUserInfo: (userId: number) => {
    return http.get<IUserInfo>(`/users/getUserInfo?userId=${userId}`)
  }
}

export default user
