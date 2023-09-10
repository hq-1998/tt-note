export enum ELoginType {
  verifyCode = 1,
  passwordCode = 2
}

export type IUserPwd = {
  type: ELoginType
  account: string
  password: string
}

export interface IUserCode {
  type: ELoginType
  account: string
  code: number
}

export interface IResetPassword {
  account: string
  newPassword: string
  code: number
}

export type IUser = IUserPwd | IUserCode

export enum EGender {
  MAN = 1,
  WOMAN = 2,
  UNKNOWN = 3
}

export interface IUserInfo {
  /** 用户id */
  id: number
  /** 用户账号 */
  account?: string
  /** 用户昵称 */
  nickName?: string
  /** 用户头像 */
  avatar?: string
  /** 用户性别 */
  gender: EGender
  /** 省 */
  province: number
  /** 市 */
  city: number
  /** 签名 */
  signature: string
}

export interface ILoginRes {
  token: string
  userInfo: {
    account: string
    password: string
  }
}

export interface IVerifyCode {
  account: string
}
