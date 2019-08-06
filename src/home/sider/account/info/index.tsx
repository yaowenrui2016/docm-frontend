import React from 'react'
import { Layout, Form } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { UserContext } from '../../../index'

const { Content } = Layout

type IProps = RouteComponentProps & {}

interface IState {}

class Info extends React.Component<IProps, IState> {
  renderContent() {
    return (
      <UserContext.Consumer>
        {userInfo => {
          return (
            <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
              <Form.Item key={'username'} label="用户名">
                {userInfo.username}
              </Form.Item>
              <Form.Item key={'phone'} label="手机">
                {userInfo.phone}
              </Form.Item>
              <Form.Item key={'email'} label="邮箱">
                {userInfo.email}
              </Form.Item>
            </Form>
          )
        }}
      </UserContext.Consumer>
    )
  }

  render() {
    return (
      <Content>
        <div
          style={{
            margin: '4px 4px 10px',
            display: 'flex',
            alignItems: 'center'
          }}
        />
        <div style={{ margin: '8px' }}>{this.renderContent()}</div>
      </Content>
    )
  }
}

export default withRouter(Info)
