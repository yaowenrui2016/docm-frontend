import React, { Component } from 'react'
import './index.css'
import { Layout } from 'antd'
import UserSider from '../user/index'
import HomeHeader from './header/index'

interface IProps {
  userId: string
}

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
        <HomeHeader userId={this.props.userId} />
        <UserSider />
      </Layout>
    )
  }
}

export default Home
