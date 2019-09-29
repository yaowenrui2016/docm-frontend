import React, { Component } from 'react'
import './index.css'
import { Layout, Menu, Dropdown, Button, Icon } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import headerMenu from '../menu'
import { UserContext } from '../index'

const { Header } = Layout

interface IProps extends RouteComponentProps {}

interface IState {}

class HomeHeader extends Component<IProps, IState> {
  fetchDefaultSelectedKey = menus => {
    const { pathname } = this.props.location
    const menuPaths = menus.map(m => m.key)
    const selectedKeys = menuPaths.filter(path => {
      return pathname.indexOf(path) >= 0
    })
    if (selectedKeys.length < 1) {
      return [menuPaths[0]]
    }
    return selectedKeys
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <Button
            onClick={() => {
              this.props.history.push('/main/account/mod-pwd')
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
      <UserContext.Consumer>
        {userInfo => {
          const menus = headerMenu.filter(m => {
            if (userInfo['username'] === 'admin') {
              return m.role.filter(role => role === 'admin').length > 0
            } else {
              return m.role.filter(role => role === 'normal').length > 0
            }
          })
          const selectedKeys = this.fetchDefaultSelectedKey(menus)
          return (
            <div>
              <Header className="header">
                {/* <span key="logo" className="logo">
                  LOGO
                </span> */}
                <Menu
                  className="navbar"
                  theme="dark"
                  mode="horizontal"
                  selectedKeys={selectedKeys}
                  style={{ lineHeight: '50px' }}
                  onSelect={param => {
                    const { history, match } = this.props
                    history.push(match.path + param.key)
                  }}
                >
                  {menus.map(m => {
                    return (
                      <Menu.Item className="navbar-item" key={m.key}>
                        {m.title}
                      </Menu.Item>
                    )
                  })}
                </Menu>
                <Menu
                  className="userbar"
                  theme="dark"
                  mode="horizontal"
                  style={{ lineHeight: '50px' }}
                  selectable={false}
                >
                  <Menu.Item key="user">
                    <Dropdown overlay={menu} placement="bottomRight">
                      <span>
                        <Icon
                          style={{ fontSize: '18px', color: '#fff' }}
                          type="user"
                        />
                        <span
                          style={{
                            fontSize: '18px',
                            color: '#fff',
                            margin: '0 8px 0 0'
                          }}
                        >
                          {userInfo['username']}
                        </span>
                        <Icon style={{ color: '#fff' }} type="caret-down" />
                      </span>
                    </Dropdown>
                  </Menu.Item>
                </Menu>
              </Header>
            </div>
          )
        }}
      </UserContext.Consumer>
    )
  }
}

export default withRouter(HomeHeader)
