import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Result } from 'antd'
import { UserContext } from '../../home/index'
// import Http from '../http/index'

// 这个组件将根据登录的情况, 返回一个路由
const PrivateRoute = ({ component: Component, ...props }) => {
  // 解构赋值 将 props 里面的 component 赋值给 Component
  return (
    <UserContext.Consumer>
      {userInfo => {
        const needPerms = props['permission']
        const userPerms = userInfo['permissions']
        const perm = needPerms
          ? userPerms.find(userPerm => {
              if (needPerms instanceof Array) {
                return needPerms.find(needPerm => userPerm.id === needPerm)
              } else {
                return userPerm.id === needPerms
              }
            })
          : 'true'
        return (
          <Route
            {...props}
            render={p => {
              let userId = sessionStorage.getItem('userId')
              // if (!userId) {
              //   debugger
              //   Http.get(`/account?id=`).then(res => {
              //     userId = res.data.data.id
              //     sessionStorage.setItem('userId', res.data.data.id)
              //   })
              // }
              if (userId) {
                // 如果登录了, 返回正确的路由
                return perm ? (
                  <Component />
                ) : (
                  <Result
                    style={{ width: '100%', height: '100%' }}
                    status="403"
                    title="403"
                    subTitle="没有访问权限"
                  />
                )
              } else {
                // 没有登录就重定向至登录页面
                return (
                  <Redirect
                    to={{
                      pathname: '/login',
                      state: {
                        from: p.location.pathname
                      }
                    }}
                  />
                )
              }
            }}
          />
        )
      }}
    </UserContext.Consumer>
  )
}
export default PrivateRoute
