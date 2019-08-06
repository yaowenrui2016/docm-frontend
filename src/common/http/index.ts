import axios from 'axios'
import { createHashHistory } from 'history'
import { message } from 'antd'

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

export const serverPath = "http://localhost:8090"

const http = axios.create({
  baseURL: serverPath,
  withCredentials: false,
  timeout: 60000
});

http.interceptors.request.use(config => {
  const xAuthToken = sessionStorage.getItem('xAuthToken');
  if (xAuthToken) {
    config.headers['x-auth-token'] = xAuthToken
  }
  return config
}, error => {
  console.error('请求异常')
})

http.interceptors.response.use(response => {
  const xAuthToken = response.headers['x-auth-token']
  if (xAuthToken) {
    sessionStorage.setItem('xAuthToken', xAuthToken)
  }
  return response
}, error => {
  if (error.response.status === 401) {
    sessionStorage.removeItem('userId')
    message.error('登录超时，请重新登录', 3)
    setTimeout(() => {
      createHashHistory().push("/login")
    }, 500)
  }
})

export default http