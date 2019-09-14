import React from 'react'
import { Layout, Breadcrumb } from 'antd'
import {
  HashRouter,
  Redirect,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom'
import PrivateRoute from '../../../common/route'
import ListCmpt from './list'
import ViewCmpt from './view'

export const modulePath = `/main/operlog`

const { Sider } = Layout

type IProps = RouteComponentProps & {}

interface IState {}

class Operlog extends React.Component<IProps, IState> {
  render() {
    const path = this.props.location.pathname
    let curItem
    if (path.indexOf(`${modulePath}/view`) >= 0) {
      curItem = '详情'
    } else if (path.indexOf(`${modulePath}/list`) >= 0) {
      curItem = '查询'
    }
    return (
      <Layout>
        {/* 包裹内容的灰色边框，需要Sider的协助 */}
        <Sider width={0}></Sider>
        <Layout>
          <div className="layout-content">
            <div className="layout-content-inner">
              <Breadcrumb>
                <Breadcrumb.Item>当前位置：</Breadcrumb.Item>
                <Breadcrumb.Item
                  onClick={() => this.props.history.push(`${modulePath}`)}
                >
                  日志审计
                </Breadcrumb.Item>
                <Breadcrumb.Item>{curItem}</Breadcrumb.Item>
              </Breadcrumb>
              <HashRouter>
                <Switch>
                  <Redirect
                    path={modulePath}
                    exact={true}
                    to={`${modulePath}/list`}
                  />
                  <PrivateRoute
                    path={`${modulePath}/list`}
                    component={ListCmpt}
                  />
                  <PrivateRoute
                    path={`${modulePath}/view/:id`}
                    component={ViewCmpt}
                  />
                  <Redirect
                    path={`${modulePath}/**`}
                    to={`${modulePath}/list`}
                  />
                </Switch>
              </HashRouter>
            </div>
          </div>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(Operlog)
