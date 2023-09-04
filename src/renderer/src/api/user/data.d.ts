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
