import React from 'react'
import {
  Layout
  // Menu, Icon
} from 'antd'
import {
  HashRouter,
  Route,
  Redirect,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom'
import ListCmpt from './list'
import EditCmpt from './edit'
// import ViewCmpt from './view'

const { Sider } = Layout

type IProps = RouteComponentProps & {
  username: string
}

interface IState {
  collapsed: boolean
}

class Docm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      collapsed: false
    }
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
      <Layout>
        <Sider width={0} />
        <Layout style={{ padding: '0 24px 24px' }}>
          <div style={{ margin: '0px', background: 'rgb(255, 255, 255)' }}>
            <HashRouter>
              <Switch>
                <Redirect
                  path={'/main/docm'}
                  exact={true}
                  to={'/main/docm/list'}
                />
                <Route path={'/main/docm/list'} component={ListCmpt} />
                <Route path={'/main/docm/edit/:id'} component={EditCmpt} />
                <Route path={'/main/docm/edit'} component={EditCmpt} />
                {/* <Route path={'/main/docm/view'} component={ViewCmpt} /> */}
              </Switch>
            </HashRouter>
          </div>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(Docm)
