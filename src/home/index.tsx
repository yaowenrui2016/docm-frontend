import React, { Component } from 'react'
import { Layout } from 'antd'
import HomeHeader from './header/index'
import HomeSider from './sider/index'
import Http from '../common/http'
import './index.css'
import IAccountVO from './sider/user/manage/type'

interface IProps {}

interface IState {}

export const UserContext = React.createContext<IAccountVO>({} as IAccountVO)

class Home extends Component<IProps, IState> {
  state = {
    collapsed: false,
    userInfo: {} as IAccountVO
  }

  componentDidMount() {
    Http.get(`/user?id=${sessionStorage.getItem('userId')}`)
      .then(res => {
        const userInfo = { ...res.data.data }
        this.setState({ userInfo })
      })
      .catch(err => {})
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const { userInfo } = this.state
    return userInfo['id'] ? (
      <UserContext.Provider value={userInfo}>
        <Layout className="ant-layout-home">
          <HomeHeader />
          <HomeSider />
        </Layout>
      </UserContext.Provider>
    ) : (
      <div />
    )
  }
}

export default Home
