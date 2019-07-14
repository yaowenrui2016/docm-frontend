import Axios from 'axios'

export const serverPath = "http://localhost:8090"

export let xAuthToken

export class Http {
  static put = (path: string, data?: any, config?: any) => {
    xAuthToken = sessionStorage.getItem('xAuthToken')
    const headers = Object.assign({ 'x-auth-token': xAuthToken }, config ? config['headers'] : {})
    const aConfig = Object.assign(config ? config : {}, { headers })
    return Axios.put(`${serverPath}${path}`, data, aConfig)
  }
  static post = (path: string, data?: any, config?: any) => {
    xAuthToken = sessionStorage.getItem('xAuthToken')
    const headers = Object.assign({ 'x-auth-token': xAuthToken }, config ? config['headers'] : {})
    const aConfig = Object.assign(config ? config : {}, { headers })
    return Axios.post(`${serverPath}${path}`, data, aConfig)
  }
  static get = (path: string, config?: any) => {
    xAuthToken = sessionStorage.getItem('xAuthToken')
    const headers = Object.assign({ 'x-auth-token': xAuthToken }, config ? config['headers'] : {})
    const aConfig = Object.assign(config ? config : {}, { headers })
    return Axios.get(`${serverPath}${path}`, aConfig)
  }
  static delete = (path: string, config?: any) => {
    xAuthToken = sessionStorage.getItem('xAuthToken')
    const headers = Object.assign({ 'x-auth-token': xAuthToken }, config ? config['headers'] : {})
    const aConfig = Object.assign(config ? config : {}, { headers })
    return Axios.delete(`${serverPath}${path}`, aConfig)
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