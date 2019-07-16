import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import PrivateRoute from './common/route'
import Home from './home/index'
import Login from './login/index'
import './index.css'

interface IProps {}

interface IState {}

class App extends PureComponent<IProps, IState> {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Redirect path={'/'} exact={true} to={'/main'} />
          <Route path={'/login'} component={Login} />
          <PrivateRoute path={'/main'} component={Home} />
        </Switch>
      </HashRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
