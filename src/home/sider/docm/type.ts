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
  dept: { id: string, name: string }
  attachments: Array<{
    docName: string
    docPath: string
  }>
  createTime: string
  lastModifyTime: string
}