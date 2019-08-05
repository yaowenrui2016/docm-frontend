import React from 'react'
import './index.css'
import { Layout, Menu, Icon } from 'antd'
import {
  HashRouter,
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom'
import Info from './info'
import ModPwd from './mod-pwd'

export const modulePath = `/main/account`

const { Sider } = Layout

type IProps = RouteComponentProps & {}

interface IState {
  collapsed: boolean
  selectedKeys: Array<string>
}

class AccountSider extends React.Component<IProps, IState> {
  state: IState = {
    collapsed: false,
    selectedKeys: []
  }

  componentDidMount() {
    const defaultSelectedKey = '/info'
    this.handleOnSelect({ key: defaultSelectedKey })
  }

  handleOnSelect = param => {
    const { key } = param
    this.setState({ selectedKeys: [key] })
    this.props.history.push(`${modulePath}${key}`)
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const { selectedKeys } = this.state
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
          <Menu
            selectedKeys={selectedKeys}
            mode="inline"
            theme="dark"
            onSelect={this.handleOnSelect}
          >
            <Menu.Item className="aside-item" key="/info">
              <Icon type="user" />
              <span>账号信息</span>
            </Menu.Item>
            <Menu.Item className="aside-item" key="/mod-pwd">
              <Icon type="safety-certificate" />
              <span>修改密码</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <HashRouter>
            <Switch>
              <Route path={`${modulePath}/info`} component={Info} />
              <Route path={`${modulePath}/mod-pwd`} component={ModPwd} />
            </Switch>
          </HashRouter>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(AccountSider)
