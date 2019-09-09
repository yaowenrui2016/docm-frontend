import React from 'react'
import {
  Layout,
  Button,
  message,
  Form,
  Col,
  Row,
  Input,
  Breadcrumb
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { UserContext } from '../../../index'
import Http from '../../../../common/http'
import md5 from 'js-md5'
import { modulePath } from '../index'

const { Content } = Layout

type IProps = RouteComponentProps & {}

interface IState {
  id: string | undefined // 为了设置form表单的id字段
}

class ModPwd extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined = undefined

  constructor(props) {
    super(props)
    this.state = {
      id: undefined
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.form &&
      this.form.props.form.validateFields((err, fielldValues) => {
        if (!err) {
          const { id, oldPassword, password } = fielldValues
          const values = {
            id,
            oldPassword: md5(oldPassword),
            password: md5(password)
          }
          Http.post('/account/mod-pwd', values)
            .then(res => {
              if (res.data.status === '00000000') {
                message.success('修改成功，请重新登录')
                sessionStorage.removeItem('userId')
                this.props.history.push(`${modulePath}/mod-pwd`)
              } else {
                message.error(res.data.message)
              }
            })
            .catch(err => {
              message.error(err.response.data.message)
            })
        }
      })
  }

  renderContent() {
    return (
      <UserContext.Consumer>
        {userInfo => {
          const { id } = userInfo
          if (!this.state.id) {
            this.setState({ id })
          } else {
            this.form && this.form.props.form.setFieldsValue({ id })
          }
          return (
            <div>
              <WrappedNormalForm
                wrappedComponentRef={(form: React.ReactElement<FormProps>) => {
                  this.form = form
                }}
              />
              <Row gutter={60}>
                <Col span={3} offset={9}>
                  <Button block type={'primary'} onClick={this.handleSubmit}>
                    {'提交'}
                  </Button>
                </Col>
              </Row>
            </div>
          )
        }}
      </UserContext.Consumer>
    )
  }

  render() {
    return (
      <div className="layout-content">
        <div className="layout-content-inner">
          <Breadcrumb separator={'>'} style={{ margin: '8px' }}>
            <Breadcrumb.Item>当前位置：</Breadcrumb.Item>
            <Breadcrumb.Item>我的账号</Breadcrumb.Item>
            <Breadcrumb.Item>修改密码</Breadcrumb.Item>
          </Breadcrumb>
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
        </div>
      </div>
    )
  }
}

export default withRouter(ModPwd)

interface FormProps extends FormComponentProps {}

interface FormState {}

class NormalForm extends React.Component<FormProps, FormState> {
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    return (
      <Form>
        {getFieldDecorator('id')(<Input hidden />)}
        <Row gutter={60}>
          <Col span={8} offset={4}>
            <Form.Item key={'oldPassword'} label="原密码">
              {getFieldDecorator('oldPassword', {
                rules: [
                  {
                    required: true,
                    message: '密码为4~16位任意字符',
                    pattern: /^.{4,16}$/
                  }
                ],
                validateTrigger: 'onBlur'
              })(<Input type={'password'} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={60}>
          <Col span={8} offset={4}>
            <Form.Item key={'password'} label="新密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '密码为4~16位任意字符',
                    pattern: /^.{4,16}$/
                  }
                ],
                validateTrigger: 'onBlur'
              })(<Input type={'password'} placeholder={'请输入密码'} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={60}>
          <Col span={8} offset={4}>
            <Form.Item key={'confirmPassword'} label="确认密码">
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                    message: '密码为4~16位任意字符',
                    pattern: /^.{4,16}$/
                  },
                  {
                    message: '两次输入密码不一致',
                    validator: async (
                      rule,
                      value,
                      callback,
                      source,
                      options
                    ) => {
                      const password = getFieldValue('password')
                      if (password !== value) {
                        callback('error')
                      } else {
                        callback()
                      }
                    }
                  }
                ],
                validateTrigger: 'onBlur'
              })(<Input type={'password'} placeholder={'请再次输入密码'} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedNormalForm = Form.create({
  name: 'mod_pwd'
})(NormalForm)
