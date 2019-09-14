import React from 'react'
import { Layout, Form, Spin, Button, Row, Col } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import IDocmVO from '../type'
import Http from '../../../../common/http'
import { modulePath } from '../index'

const { Content } = Layout

const viewItemLayout = {
  span: 12,
  offset: 0
}

const formItemLayout = {
  labelCol: {
    span: 4,
    offset: 2
  },
  wrapperCol: {
    span: 16,
    offset: 0
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
  data: IDocmVO | undefined
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
      Http.get(`/operlog?id=${id}`)
        .then(res => {
          this.setState({ loading: false, data: res.data.data })
        })
        .catch(error => {})
    })
  }

  handleCancel = e => {
    e.preventDefault()
    this.props.history.push(`${modulePath}/list`)
  }

  renderContent() {
    const { loading, data } = this.state
    return !loading && data ? (
      <Form {...formItemLayout}>
        <Row>
          <Col {...viewItemLayout}>
            <Form.Item key={'name'} label="操作名称">
              {data.name}
            </Form.Item>
          </Col>
          <Col {...viewItemLayout}>
            <Form.Item key={'module'} label="模块名称">
              {data.module}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...viewItemLayout}>
            <Form.Item key={'operator'} label="操作者">
              {data.operator}
            </Form.Item>
          </Col>
          <Col {...viewItemLayout}>
            <Form.Item key={'createTime'} label="操作时间">
              {data.createTime}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...viewItemLayout}>
            <Form.Item key={'result'} label="操作结果">
              {data.result}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...viewItemLayout}>
            <Form.Item key={'ip'} label="远程IP">
              {data.ip}
            </Form.Item>
          </Col>
          <Col {...viewItemLayout}>
            <Form.Item key={'userAgent'} label="UserAgent">
              {data.userAgent}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...viewItemLayout}>
            <Form.Item key={'method'} label="HTTP方法">
              {data.method}
            </Form.Item>
          </Col>
          <Col {...viewItemLayout}>
            <Form.Item key={'url'} label="URL">
              {data.url}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...viewItemLayout}>
            <Form.Item key={'contractNum'} label="操作内容">
              {data.content}
            </Form.Item>
          </Col>
          <Col {...viewItemLayout}></Col>
        </Row>
      </Form>
    ) : (
      <Spin size={'large'} />
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
        >
          <div style={{ margin: '4px', flex: 1 }}>
            <span style={{ float: 'right' }}>
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
