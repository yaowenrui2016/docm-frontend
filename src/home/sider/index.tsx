import React from 'react'
import './index.css'
import {
  HashRouter,
  Switch,
  withRouter,
  Redirect,
  Route,
  RouteComponentProps
} from 'react-router-dom'
import UserModule from './user/index'
import DocmModule from './docm/index'
import AccountModule from './account/index'
import headerMenu from '../menu'
import { UserContext } from '../index'

type IProps = RouteComponentProps & {}

type IState = {}

class Side extends React.Component<IProps, IState> {
  render() {
    return (
      <UserContext.Consumer>
        {userInfo => {
          const menus = headerMenu.filter(m => {
            if (userInfo['username']) {
              if (userInfo['username'] === 'admin') {
                return m.role.filter(role => role === 'admin').length > 0
              } else {
                return m.role.filter(role => role === 'normal').length > 0
              }
            }
            return false
          })
          const routeMap = [
            {
              key: '/docm',
              value: <Route path={'/main/docm'} component={DocmModule} />
            },
            {
              key: '/user',
              value: <Route path={'/main/user'} component={UserModule} />
            },
            {
              key: '/account',
              value: <Route path={'/main/account'} component={AccountModule} />
            }
          ]
          return (
            menus.length > 0 && (
              <HashRouter>
                <Switch>
                  <Redirect
                    path={'/main'}
                    exact={true}
                    to={`/main${menus[0].key}`}
                  />
                  {routeMap
                    .filter(r => menus.filter(m => m.key === r.key).length > 0)
                    .map(r => r.value)}
                </Switch>
              </HashRouter>
            )
          )
        }}
      </UserContext.Consumer>
    )
  }
}

export default withRouter(Side)
