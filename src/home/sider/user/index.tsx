import React from 'react'
import './index.css'
import { Layout, Menu, Icon, Button, Breadcrumb, Select } from 'antd'

const { Sider, Content } = Layout

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
          collapsedWidth={100}
        >
          <span className="aside-top" onClick={this.toggleCollapsed}>
            <span className="aside-top-label">用户管理</span>
            <Icon
              className="aside-top-icon"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            />
          </span>
          <Menu defaultSelectedKeys={['/normal']} mode="inline" theme="dark">
            <Menu.Item className="aside-item" key="/normal">
              <Icon type="user" />
              <span>普通用户</span>
            </Menu.Item>
            <Menu.Item className="aside-item" key="/authority">
              <Icon type="safety-certificate" />
              <span>授权应用</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
          >
            <div className="for-test">
              <div className="for-test-header">
                <Select
                  mode="default"
                  placeholder="请输入关键字"
                  style={{ width: '50%' }}
                  showArrow={false}
                  onSearch={this.handleSearch}
                  showSearch
                />
                <Button type="primary">新建</Button>
                <a className="for-test-a" href={'/'}>
                  一键展开
                </a>
              </div>
              <div tabIndex={1} className="for-test-content" />
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default UserSider
