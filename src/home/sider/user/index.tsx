import React from 'react'
import './index.css'
import { Layout, Menu, Icon, Result } from 'antd'

const { Sider } = Layout

class UserSider extends React.Component {
  state = {
    collapsed: false
  }

  handleSearch = (value: string) => {
    console.log(value)
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    return (
      <Layout>
        <Sider
          width={180}
          theme="dark"
          collapsed={this.state.collapsed}
          collapsedWidth={80}
        >
          <span className="aside-top" onClick={this.toggleCollapsed}>
            <Icon
              style={{ margin: '0 0 0 10px' }}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            />
          </span>
          <Menu defaultSelectedKeys={['/normal']} mode="inline" theme="dark">
            <Menu.Item className="aside-item" key="/normal">
              <Icon type="user" />
              <span>账号管理</span>
            </Menu.Item>
            <Menu.Item className="aside-item" key="/authority">
              <Icon type="safety-certificate" />
              <span>权限管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Result status="403" title="403" subTitle="对不起，拒绝访问" />
        </Layout>
      </Layout>
    )
  }
}

export default UserSider
