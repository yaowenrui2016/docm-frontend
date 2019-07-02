import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Home from './home/index'
import Login from './login/index'
import './index.css'

interface IProps {}

interface IState {
  userId: string | undefined
}

class App extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      userId: undefined
    }
  }

  renderMain() {
    const userId = sessionStorage.getItem('userId')
    return userId ? <Home userId={userId} /> : <Login />
  }

  render() {
    return (
      <HashRouter>
        <Switch>
          <Redirect path={'/'} exact={true} to={'/main'} />
          <Route path={'/main'} render={() => this.renderMain()} />
        </Switch>
      </HashRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
