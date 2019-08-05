import React from 'react'
import './index.css'
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

type IProps = RouteComponentProps & {}

interface IState {}

class Manage extends React.Component<IProps, IState> {
  render() {
    return (
      <div style={{ margin: '0px', background: 'rgb(255, 255, 255)' }}>
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
            {/* <Route path={'/main/docm/view'} component={ViewCmpt} /> */}
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default withRouter(Manage)
