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
import EditCmpt from './edit'
import ViewCmpt from './view'
import PreviewCmpt from './preview/index'

export const modulePath = `/main/docm`

const { Sider } = Layout

type IProps = RouteComponentProps & {}

interface IState {}

class Docm extends React.Component<IProps, IState> {
  render() {
    const path = this.props.location.pathname
    let curItem
    if (path.indexOf(`${modulePath}/add`) >= 0) {
      curItem = '新增'
    } else if (path.indexOf(`${modulePath}/edit`) >= 0) {
      curItem = '编辑'
    } else if (path.indexOf(`${modulePath}/view`) >= 0) {
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
                  我的项目
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
                    permission={['DOCM_LIST_VIEW', 'DOCM_LIST_DEPT_VIEW']}
                    component={ListCmpt}
                  />
                  <PrivateRoute
                    path={`${modulePath}/edit/:id`}
                    permission={'DOCM_EDIT_OPER'}
                    component={EditCmpt}
                  />
                  <PrivateRoute
                    path={`${modulePath}/add`}
                    permission={'DOCM_ADD_OPER'}
                    component={EditCmpt}
                  />
                  <PrivateRoute
                    path={`${modulePath}/view/:id`}
                    permission={'DOCM_DETAIL_VIEW'}
                    component={ViewCmpt}
                  />
                  <PrivateRoute
                    path={`${modulePath}/preview`}
                    permission={'DOCM_DETAIL_VIEW'}
                    component={PreviewCmpt}
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

export default withRouter(Docm)
