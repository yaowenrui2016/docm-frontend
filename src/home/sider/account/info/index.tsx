import React from 'react'
import { Layout, Form, Breadcrumb } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { UserContext } from '../../../index'
import './index.css'

const { Content } = Layout

const formItemLayout = {
  labelCol: {
    xs: { span: 20 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 16 }
  }
}

// const tailFormItemLayout = {
//   wrapperCol: {
//     xs: {
//       span: 2,
//       offset: 0
//     },
//     sm: {
//       span: 2,
//       offset: 4
//     }
//   }
// }

type IProps = RouteComponentProps & {}

interface IState {}

class Info extends React.Component<IProps, IState> {
  renderContent() {
    return (
      <UserContext.Consumer>
        {userInfo => {
          return (
            <Form {...formItemLayout}>
              <Form.Item key={'username'} label="用户名">
                {userInfo.username}
              </Form.Item>
              <Form.Item key={'phone'} label="手机">
                {userInfo.phone}
              </Form.Item>
              <Form.Item key={'email'} label="邮箱">
                {userInfo.email}
              </Form.Item>
              <Form.Item key={'dept'} label="科室">
                {userInfo.dept ? userInfo.dept.name : ''}
              </Form.Item>
            </Form>
          )
        }}
      </UserContext.Consumer>
    )
  }

  render() {
    return (
      <div className="layout-content">
        <div className="layout-content-inner">
          <Breadcrumb separator={'>'}>
            <Breadcrumb.Item>当前位置：</Breadcrumb.Item>
            <Breadcrumb.Item>我的账号</Breadcrumb.Item>
            <Breadcrumb.Item>账号信息</Breadcrumb.Item>
          </Breadcrumb>
          <Content>
            <div className="view-page-content">{this.renderContent()}</div>
          </Content>
        </div>
      </div>
    )
  }
}

export default withRouter(Info)
