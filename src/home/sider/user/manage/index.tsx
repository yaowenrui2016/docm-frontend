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
import AddCmpt from './add'
import EditCmpt from './edit'
import ListCmpt from './list'

type IProps = RouteComponentProps & {}

interface IState {
  collapsed: boolean
  selectedKeys: Array<string>
}

class Manage extends React.Component<IProps, IState> {
  state: IState = {
    collapsed: false,
    selectedKeys: []
  }

  componentDidMount() {
    const key = '/manage'
    this.handleOnSelect({ key })
  }

  handleOnSelect = param => {
    const prePath = '/main/user'
    const { key } = param
    this.setState({ selectedKeys: [key] })
    this.props.history.push(`${prePath}${key}`)
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    return (
      <div style={{ margin: '0px', background: 'rgb(255, 255, 255)' }}>
        <HashRouter>
          <Switch>
            <Redirect
              path={'/main/user/manage'}
              exact={true}
              to={'/main/user/manage/list'}
            />
            <Route path={'/main/user/manage/list'} component={ListCmpt} />
            <Route path={'/main/user/manage/add'} component={AddCmpt} />
            <Route path={'/main/user/manage/edit/:id'} component={EditCmpt} />
            {/* <Route path={'/main/docm/view'} component={ViewCmpt} /> */}
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default withRouter(Manage)
