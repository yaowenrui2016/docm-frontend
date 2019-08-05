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

type IProps = RouteComponentProps & {}

interface IState {}

export const parentPath = `/main/docm`

class Docm extends React.Component<IProps, IState> {
  render() {
    const path = this.props.location.pathname
    let curItem
    if (path.indexOf(`${parentPath}/add`) >= 0) {
      curItem = '新增'
    } else if (path.indexOf(`${parentPath}/edit`) >= 0) {
      curItem = '编辑'
    } else if (path.indexOf(`${parentPath}/view`) >= 0) {
      curItem = '详情'
    } else if (path.indexOf(`${parentPath}/list`) >= 0) {
      curItem = '查询'
    }
    return (
      <Layout style={{ padding: '0 12px 12px' }}>
        <div style={{ margin: '0px', background: 'rgb(255, 255, 255)' }}>
          <Breadcrumb style={{ margin: '8px' }}>
            <Breadcrumb.Item>当前位置：</Breadcrumb.Item>
            <Breadcrumb.Item
              onClick={() => this.props.history.push(`${parentPath}`)}
            >
              我的项目
            </Breadcrumb.Item>
            <Breadcrumb.Item>{curItem}</Breadcrumb.Item>
          </Breadcrumb>
          <HashRouter>
            <Switch>
              <Redirect
                path={parentPath}
                exact={true}
                to={`${parentPath}/list`}
              />
              <PrivateRoute
                path={`${parentPath}/list`}
                permission={'DOCM_LIST_VIEW'}
                component={ListCmpt}
              />
              <PrivateRoute
                path={`${parentPath}/edit/:id`}
                permission={'DOCM_EDIT_OPER'}
                component={EditCmpt}
              />
              <PrivateRoute
                path={`${parentPath}/add`}
                permission={'DOCM_ADD_OPER'}
                component={EditCmpt}
              />
              <PrivateRoute
                path={`${parentPath}/view/:id`}
                permission={'DOCM_DETAIL_VIEW'}
                component={ViewCmpt}
              />
              <Redirect path={`${parentPath}/**`} to={`${parentPath}/list`} />
            </Switch>
          </HashRouter>
        </div>
      </Layout>
    )
  }
}

export default withRouter(Docm)
