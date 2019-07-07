import React from 'react'
import { Layout, Menu, Icon } from 'antd'
import {
  HashRouter,
  Route,
  Redirect,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom'
import ListCmpt from './list'
import EditCmpt from './edit'
// import ViewCmpt from './view'

const { Sider } = Layout

type IProps = RouteComponentProps & {
  username: string
}

interface IState {
  collapsed: boolean
}

class Docm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      collapsed: false
    }
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
            <span className="aside-top-label">文档库</span>
            <Icon
              className="aside-top-icon"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            />
          </span>
          <Menu defaultSelectedKeys={['file']} mode="inline" theme="dark">
            <Menu.Item className="aside-item" key="file">
              <Icon type="file-search" />
              <span>文档管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <div style={{ margin: '0px', background: 'rgb(255, 255, 255)' }}>
            <HashRouter>
              <Switch>
                <Redirect
                  path={'/main/docm'}
                  exact={true}
                  to={'/main/docm/list'}
                />
                <Route path={'/main/docm/edit/:id'} component={EditCmpt} />
                <Route path={'/main/docm/list'} component={ListCmpt} />
                {/* <Route path={'/main/docm/view'} component={ViewCmpt} /> */}
              </Switch>
            </HashRouter>
          </div>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(Docm)
