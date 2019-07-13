import React, { Component } from 'react'
import './index.css'
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'

const { Header } = Layout

interface IProps extends RouteComponentProps {
  userId: string
}

interface IState {}

class HomeHeader extends Component<IProps, IState> {
  render() {
    const { userId } = this.props
    const menu = (
      <Menu>
        <Menu.Item>
          <Button
            onClick={() => {
              this.props.history.push('/main/user')
            }}
          >
            {'账号设置'}
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            onClick={() => {
              sessionStorage.removeItem('userId')
              this.props.history.push('/main')
            }}
          >
            {'退出'}
          </Button>
        </Menu.Item>
      </Menu>
    )
    return (
      <div>
        <Header className="header">
          {/* <div key="logo" className="logo" /> */}
          <Menu
            className="navbar"
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['/docm']}
            style={{ lineHeight: '64px' }}
            onSelect={param => {
              const { history, match } = this.props
              history.push(match.path + param.key)
            }}
          >
            <Menu.Item className="navbar-item" key="/docm">
              我的项目
            </Menu.Item>
            <Menu.Item className="navbar-item" key="/user">
              账户与安全
            </Menu.Item>
          </Menu>
          <Dropdown overlay={menu} placement="bottomRight">
            <Avatar size="large">{userId}</Avatar>
          </Dropdown>
        </Header>
      </div>
    )
  }
}

export default withRouter(HomeHeader)
