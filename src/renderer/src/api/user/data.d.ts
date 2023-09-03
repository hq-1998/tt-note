interface IUser {
  account: string
  password: string
}

interface ILoginRes {
  token: string
  userInfo: {
    account: string
    password: string
  }
}
