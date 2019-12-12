export default interface IDocmVO {
  id: string
  name: string
  projectName: string
  projectType: string
  company: string
  contractNum: string
  contractTime: string
  money: number
  dept: IDeptVO
  attachments: Array<IAttachmentVO>
  payItems: Array<IPayItemVO>
  desc: string
  createTime: string
  lastModifyTime: string
}

export interface IDeptVO {
  id: string
  name: string
}

export interface IAttachmentVO {
  id?: string
  docmId?: string
  docName: string
  docPath: string
  type: string
  size: number
  md5: string
}

export interface IPayItemVO {
  id: string
  order: number
  money: number
  credentialNum: string
  credentialTime: string
  payTime: string
  desc: string
}