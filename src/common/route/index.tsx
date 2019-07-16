import React from 'react'
import { Route, Redirect } from 'react-router-dom'

// 这个组件将根据登录的情况, 返回一个路由
const PrivateRoute = ({ component: Component, ...props }) => {
  // 解构赋值 将 props 里面的 component 赋值给 Component
  return (
    <Route
      {...props}
      render={p => {
        const userId = sessionStorage.getItem('userId')
        if (userId) {
          // 如果登录了, 返回正确的路由
          return <Component />
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
}
export default PrivateRoute
