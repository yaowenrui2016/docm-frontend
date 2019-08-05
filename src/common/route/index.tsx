import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Result } from 'antd'
import { UserContext } from '../../home/index'

// 这个组件将根据登录的情况, 返回一个路由
const PrivateRoute = ({ component: Component, ...props }) => {
  // 解构赋值 将 props 里面的 component 赋值给 Component
  return (
    <UserContext.Consumer>
      {userInfo => {
        const perm = props['permission']
          ? userInfo['permissions'].find(
              perm => perm.id === props['permission']
            )
          : 'true'
        return (
          <Route
            {...props}
            render={p => {
              const userId = sessionStorage.getItem('userId')
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
