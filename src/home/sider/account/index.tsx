import React from 'react'
import './index.css'
import { Layout, Menu, Icon } from 'antd'
import {
  HashRouter,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom'
import PrivateRoute from '../../../common/route'
import Info from './info'
import ModPwd from './mod-pwd'

export const modulePath = `/main/account`

const { Sider } = Layout

const menusKey = ['/info', '/mod-pwd']

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
    const key = this.fetchDefaultSelectedKey()
    this.handleOnSelect({ key })
  }

  fetchDefaultSelectedKey() {
    const { pathname } = this.props.location
    const selectedKeys = menusKey.filter(key => {
      return pathname.indexOf(key) >= 0
    })
    if (selectedKeys.length < 1) {
      return menusKey[0]
    }
    return selectedKeys[0]
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
              <Icon type="safety" />
              <span>修改密码</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <HashRouter>
            <Switch>
              <PrivateRoute path={`${modulePath}/info`} component={Info} />
              <PrivateRoute path={`${modulePath}/mod-pwd`} component={ModPwd} />
            </Switch>
          </HashRouter>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(AccountSider)
