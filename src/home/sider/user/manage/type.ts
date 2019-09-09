export default interface IAccountVO {
  id: string
  name: string
  username: string
  password: string
  phone: string
  permissions: Array<any>
  email: string
  createTime: string
  lastModifyTime: string
}

export interface IDeptVO {
  id: string
  name: string
}