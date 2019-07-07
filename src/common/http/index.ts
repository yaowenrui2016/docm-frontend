import Axios from 'axios'

const prefix = "http://localhost:8090"

export class Http {
  static put = (path: string, data?: any, config?: any) => {
    return Axios.put(`${prefix}${path}`, data, config)
  }
  static post = (path: string, data?: any, config?: any) => {
    return Axios.post(`${prefix}${path}`, data, config)
  }
  static get = (path: string, config?: any) => {
    return Axios.get(`${prefix}${path}`, config)
  }
  static delete = (path: string, config?: any) => {
    return Axios.delete(`${prefix}${path}`, config)
  }
}

export interface QueryRequest {
  pageSize: number | undefined
  current: number | undefined
  conditions?: any
  sorters?: any
}

export interface QueryResult<T> {
  total: number | undefined
  content: Array<T>
}

export default Http