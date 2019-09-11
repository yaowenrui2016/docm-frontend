import React from 'react'
import { Layout, Button, Form, Spin, Tree } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import IAccountVO from '../../../user/manage/type'
import Http from '../../../../../common/http'
import { manageSiderPath } from '../../index'

const { Content } = Layout
const { TreeNode } = Tree

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

interface IState {
  loading: boolean
  data: IAccountVO | undefined
}

class View extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      loading: true,
      data: undefined
    }
  }

  componentDidMount() {
    const { match } = this.props
    const id = match.params['id']
    this.setState({ loading: true }, () => {
      Http.get(`/user?id=${id}`)
        .then(res => {
          const data = res.data.data
          this.setState({ loading: false, data })
        })
        .catch(error => {})
    })
  }

  handleCancel = e => {
    e.preventDefault()
    this.props.history.push(`${manageSiderPath}/list`)
  }

  renderContent() {
    const { loading, data } = this.state
    return !loading && data ? (
      <Form {...formItemLayout}>
        <Form.Item key={'username'} label="用户名">
          {data.username}
        </Form.Item>
        <Form.Item key={'phone'} label="手机">
          {data.phone}
        </Form.Item>
        <Form.Item key={'email'} label="邮箱">
          {data.email}
        </Form.Item>
        <Form.Item key={'dept'} label="科室">
          {data.dept && data.dept.name}
        </Form.Item>
        <Form.Item key={'permissions'} label="账号授权">
          <Tree showLine defaultExpandAll>
            {data.permissions.map(perm => (
              <TreeNode title={perm.name} />
            ))}
          </Tree>
        </Form.Item>
      </Form>
    ) : (
      <Spin size={'large'} />
    )
  }

  render() {
    const { match } = this.props
    const id = match.params['id']
    return (
      <Content>
        <div
          style={{
            margin: '4px 4px 10px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div style={{ margin: '4px', flex: 1 }}>
            <span style={{ float: 'right' }}>
              <Button
                className={'ele-operation'}
                type={'primary'}
                onClick={event => {
                  event.preventDefault()
                  this.props.history.push(`${manageSiderPath}/edit/${id}`)
                }}
              >
                编辑
              </Button>
              <Button type={'default'} onClick={this.handleCancel}>
                返回
              </Button>
            </span>
          </div>
        </div>
        <div style={{ margin: '8px' }}>{this.renderContent()}</div>
      </Content>
    )
  }
}

export default withRouter(View)
