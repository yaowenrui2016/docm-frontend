import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import Home from './home/index'
import Login from './login/index'
import zhCN from 'antd/es/locale-provider/zh_CN'
import PrivateRoute from './common/route'
import 'moment/locale/zh-cn' // 全局修改
import './index.css'

interface IProps {}

interface IState {}

class App extends PureComponent<IProps, IState> {
  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <HashRouter>
          <Switch>
            <Redirect path={'/'} exact={true} to={'/main'} />
            <Route path={'/login'} component={Login} />
            <PrivateRoute path={'/main'} component={Home} />
          </Switch>
        </HashRouter>
      </LocaleProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
