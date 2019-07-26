import React from 'react'
import {
  Layout,
  Breadcrumb,
  Button,
  Form,
  Input,
  message,
  Col,
  Row
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import IAccountVO from '../type'
import Http from '../../../../../common/http'

const { Content } = Layout

type IProps = RouteComponentProps & {}

interface IState {
  loading: boolean
  id: string
}

class List extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined = undefined
  constructor(props: IProps) {
    super(props)
    this.state = {
      id: this.props.match.params['id'],
      loading: true
    }
  }

  componentDidMount() {
    const { id } = this.state
    this.setState({ loading: true }, () => {
      Http.get(`/user?id=${id}`)
        .then(res => {
          const data = res.data.data
          this.form &&
            this.form.props.form.setFieldsValue({
              ...data
            })
          this.setState({ loading: false })
        })
        .catch(error => {
          this.setState({ loading: false })
        })
    })
  }

  handleCancel = e => {
    e.preventDefault()
    const { match } = this.props
    const path = match.path.replace('/edit', '/list')
    this.props.history.push(path)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.form &&
      this.form.props.form.validateFields(async (err, fielldValues) => {
        if (!err) {
          const values: IAccountVO = {
            ...fielldValues
          }
          await Http.post('/user', values)
          const { match } = this.props
          const path = match.path.replace('/edit', '/list')
          this.props.history.push(path)
        }
      })
  }

  render() {
    const { loading } = this.state
    return (
      <Content>
        <Breadcrumb style={{ margin: '8px' }}>
          <Breadcrumb.Item>当前位置：</Breadcrumb.Item>
          <Breadcrumb.Item>账号与安全</Breadcrumb.Item>
          <Breadcrumb.Item>账号管理</Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            margin: '4px 4px 10px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div style={{ order: 2, flexGrow: 1, padding: '0 8px 0 0' }}>
            <span style={{ float: 'right' }}>
              <Button block type={'default'} onClick={this.handleCancel}>
                返回
              </Button>
            </span>
          </div>
        </div>
        <div style={{ margin: '8px' }}>
          <WrappedNormalForm
            wrappedComponentRef={(form: React.ReactElement<FormProps>) => {
              this.form = form
            }}
          />
          <Row gutter={60}>
            <Col span={3} offset={9}>
              <Button
                block
                type={'primary'}
                loading={loading}
                onClick={this.handleSubmit}
              >
                {'保存'}
              </Button>
            </Col>
            <Col span={3}>
              <Button
                block
                onClick={() => {
                  // TODO
                  message.info('清空表单')
                }}
              >
                {'取消'}
              </Button>
            </Col>
          </Row>
        </div>
      </Content>
    )
  }
}

export default withRouter(List)

interface FormProps extends FormComponentProps {}

interface FormState {
  defaultFileList: Array<any>
}

class NormalForm extends React.Component<FormProps, FormState> {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
        {getFieldDecorator('id')(<Input hidden />)}
        <Row gutter={60}>
          <Col span={8} offset={4}>
            <Form.Item key={'username'} label="用户名">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message:
                      '用户名为3~12位字母、数字或下划线,第一位必须为字母',
                    type: 'string',
                    pattern: /^[a-zA-Z][a-zA-Z1-9_]{2,11}$/
                  }
                ],
                validateTrigger: 'onBlur'
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8} />
        </Row>
        <Row gutter={60}>
          <Col span={8} offset={4}>
            <Form.Item key={'phone'} label="手机">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: false,
                    message: '请输入正确的手机号',
                    max: 11
                  }
                ],
                validateTrigger: 'onBlur'
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item key={'email'} label="邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: false,
                    message: '请输入正确的邮箱',
                    type: 'email'
                  }
                ],
                validateTrigger: 'onBlur'
              })(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedNormalForm = Form.create({
  name: 'normal_login'
})(NormalForm)
