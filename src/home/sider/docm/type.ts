export default interface IDocmVO {
  id: string
  name: string
  projectName: string
  projectType: string
  company: string
  contractNum: string
  contractTime: string
  money: string
  dept: { id: string, name: string }
  attachments: Array<IAttachmentVO>
  payItems: Array<IPayItemVO>
  desc: string
  createTime: string
  lastModifyTime: string
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
  order: number
  money: string
  credentialNum: string
  credentialTime: string
  desc: string
}