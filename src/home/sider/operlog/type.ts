import BaseVO from '../../../common/types'

export default interface IOperLogVO extends BaseVO {
  module: string
  result: string
  operator: string
  userAgent: string
  ip: string
  method: string
  url: string
  status: boolean
  content: string
}