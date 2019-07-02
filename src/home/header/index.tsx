import React, { Component } from 'react'
import './index.css'
import { Layout, Menu, Avatar } from 'antd'

const { Header } = Layout

interface IProps {
  userId: string
}

interface IState {}

class HomeHeader extends Component<IProps, IState> {
  render() {
    const { userId } = this.props
    return (
      <div>
        <Header className="header">
          <div key="logo" className="logo" />
          <Menu
            className="navbar"
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item className="navbar-item" key="">
              用户管理
            </Menu.Item>
            <Menu.Item className="navbar-item" key="2">
              安全设置
            </Menu.Item>
            <Menu.Item className="navbar-item" key="3">
              日志查询
            </Menu.Item>
          </Menu>
          <div className="avatar">
            <Avatar size="large">{userId}</Avatar>
          </div>
        </Header>
      </div>
    )
  }
}

export default HomeHeader
