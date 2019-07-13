export default interface IDocmVO {
  id: string
  name: string
  projectName: string
  projectType: string
  company: string
  contractNum: string
  contractTime: string
  credentialNum: string
  credentialTime: string
  money: string
  attachments: Array<{
    docName: string
    docPath: string
  }>
  state: boolean
  createTime: string
  lastModifyTime: string
}