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

type IProps = RouteComponentProps & {}

type IState = {}

class Side extends React.Component<IProps, IState> {
  state = {
    collapsed: false
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
      <HashRouter>
        <Switch>
          <Redirect path={'/main'} exact={true} to={'/main/docm'} />
          <Route path={'/main/docm'} component={DocmModule} />
          <Route path={'/main/user'} component={UserModule} />
        </Switch>
      </HashRouter>
    )
  }
}

export default withRouter(Side)
