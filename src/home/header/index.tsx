import React, { Component } from 'react'
import './index.css'
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'

const { Header } = Layout

const menuPaths = ['/docm', '/user']

interface IProps extends RouteComponentProps {}

interface IState {}

class HomeHeader extends Component<IProps, IState> {
  fetchDefaultSelectedKey = () => {
    const { pathname } = this.props.location
    const selectedKeys = menuPaths.filter(path => {
      return pathname.indexOf(path) >= 0
    })
    if (selectedKeys.length < 1) {
      return [menuPaths[0]]
    }
    return selectedKeys
  }

  render() {
    const userId = sessionStorage.getItem('userId')
    if (!userId) {
      this.props.history.push('/login')
    }
    const menu = (
      <Menu>
        <Menu.Item>
          <Button
            onClick={() => {
              this.props.history.push('/main/user/edit')
            }}
          >
            {'修改密码'}
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            onClick={() => {
              sessionStorage.removeItem('userId')
              setTimeout(() => {
                this.props.history.push('/login')
              }, 300)
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
            defaultSelectedKeys={this.fetchDefaultSelectedKey()}
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
            <Avatar
              style={{ margin: '0 8px 0 0', color: 'white', fontSize: '25px' }}
              size="large"
            >
              {userId}
            </Avatar>
          </Dropdown>
        </Header>
      </div>
    )
  }
}

export default withRouter(HomeHeader)
