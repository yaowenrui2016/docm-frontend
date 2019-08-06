import React from 'react'
import './index.css'
import { Breadcrumb } from 'antd'
import {
  HashRouter,
  Route,
  Redirect,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom'
import { manageSiderPath } from '../index'
import AddCmpt from './add'
import EditCmpt from './edit'
import ListCmpt from './list'
import ViewCmpt from './view'

type IProps = RouteComponentProps & {}

interface IState {}

class Manage extends React.Component<IProps, IState> {
  render() {
    const path = this.props.location.pathname
    let curItem
    if (path.indexOf(`${manageSiderPath}/add`) >= 0) {
      curItem = '新增'
    } else if (path.indexOf(`${manageSiderPath}/edit`) >= 0) {
      curItem = '编辑'
    } else if (path.indexOf(`${manageSiderPath}/view`) >= 0) {
      curItem = '详情'
    } else if (path.indexOf(`${manageSiderPath}/list`) >= 0) {
      curItem = '查询'
    }
    return (
      <div style={{ margin: '0px', background: 'rgb(255, 255, 255)' }}>
        <Breadcrumb style={{ margin: '8px' }}>
          <Breadcrumb.Item>当前位置：</Breadcrumb.Item>
          <Breadcrumb.Item>账号与安全</Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => this.props.history.push(`${manageSiderPath}`)}
          >
            账号管理
          </Breadcrumb.Item>
          <Breadcrumb.Item>{curItem}</Breadcrumb.Item>
        </Breadcrumb>
        <HashRouter>
          <Switch>
            <Redirect
              path={`${manageSiderPath}`}
              exact={true}
              to={`${manageSiderPath}/list`}
            />
            <Route path={`${manageSiderPath}/list`} component={ListCmpt} />
            <Route path={`${manageSiderPath}/add`} component={AddCmpt} />
            <Route path={`${manageSiderPath}/edit/:id`} component={EditCmpt} />
            <Route path={`${manageSiderPath}/view/:id`} component={ViewCmpt} />
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default withRouter(Manage)
