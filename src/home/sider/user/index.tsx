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
import Manage from './manage'
// import Authority from './authority'

const { Sider } = Layout

type IProps = RouteComponentProps & {}

interface IState {
  collapsed: boolean
  selectedKeys: Array<string>
}

class UserSider extends React.Component<IProps, IState> {
  state: IState = {
    collapsed: false,
    selectedKeys: []
  }

  componentDidMount() {
    const key = '/manage'
    this.handleOnSelect({ key })
  }

  handleOnSelect = param => {
    const prePath = '/main/user'
    const { key } = param
    this.setState({ selectedKeys: [key] })
    this.props.history.push(`${prePath}${key}`)
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
            <Menu.Item className="aside-item" key="/manage">
              <Icon type="user" />
              <span>账号管理</span>
            </Menu.Item>
            <Menu.Item className="aside-item" key="/authority">
              <Icon type="safety-certificate" />
              <span>授权查询</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          {/* <Result status="403" title="403" subTitle="对不起，拒绝访问" /> */}
          <HashRouter>
            <Switch>
              <Route path={'/main/user/manage'} component={Manage} />
              {/* <Route path={'/main/user/authority'} component={Authority} /> */}
            </Switch>
          </HashRouter>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(UserSider)
