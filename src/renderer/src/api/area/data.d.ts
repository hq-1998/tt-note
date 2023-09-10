export interface IProvince {
  pid: number
  name: string
}

export interface ICity extends IProvince {
  cid: number
}
