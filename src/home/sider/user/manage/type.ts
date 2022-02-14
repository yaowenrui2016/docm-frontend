export default interface IAccountVO {
  id: string
  name: string
  username: string
  password: string
  phone: string
  permissions: Array<any>
  dept: { id: string, name: string }
  email: string
  createTime: string
  lastModifyTime: string
}

export interface IDeptVO {
  id: string
  name: string
}

export interface IinvalidAttachInfo {
  path: string
  attachId: string
}