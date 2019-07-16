import React, { Component } from 'react'
import { Layout } from 'antd'
import HomeHeader from './header/index'
import HomeSider from './sider/index'
import './index.css'

interface IProps {}

interface IState {}

class Home extends Component<IProps, IState> {
  state = {
    collapsed: false
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    return (
      <Layout className="ant-layout-home">
        <HomeHeader />
        <HomeSider />
      </Layout>
    )
  }
}

export default Home
