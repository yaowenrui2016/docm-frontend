import React from 'react'
import { Form, Icon, Input, Button, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Http from '../common/http/index'
import md5 from 'js-md5'
import img from '../assert/img/aaa.jpg'
import './index.css'

type IProps = RouteComponentProps & {}

interface IState {}

class Login extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined

  handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    this.form &&
      this.form.props.form.validateFields(async (err, values) => {
        if (!err) {
          const password = md5(values.password)
          await Http.post('/login', { ...values, password })
            .then(res => {
              if (res.data.status === '00000000') {
                sessionStorage.setItem('userId', res.data.data.username)
                setTimeout(() => {
                  this.props.history.push('/main')
                }, 300)
              } else {
                this.form &&
                  this.form.props.form.setFields({
                    password: {
                      value: values.password,
                      errors: [new Error(res.data.message)]
                    }
                  })
              }
            })
            .catch(err => {
              message.error('服务器异常')
            })
        }
      })
  }

  render() {
    return (
      <div
        id="hehe"
        style={{
          width: '100%',
          height: '100%',
          // paddingBottom: '48%',
          overflow: 'hidden',
          backgroundPosition: '50%',
          backgroundRepeat: 'no - repeat',
          backgroundSize: 'cover',
          backgroundImage: `url(${img})`
        }}
      >
        <div className="login-form">
          <WrappedNormalLoginForm
            wrappedComponentRef={(form: React.ReactElement<FormProps>) => {
              this.form = form
            }}
          />
          <Button
            className="login-form-button"
            type="primary"
            onClick={this.handleSubmit}
          >
            登录
          </Button>
        </div>
      </div>
    )
  }
}

export default withRouter(Login)

interface FormProps extends FormComponentProps {
  username: string
  password: string
  onSubmit?: () => void
}

class NormalLoginForm extends React.Component<FormProps, any> {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
      </Form>
    )
  }
}

const WrappedNormalLoginForm = Form.create({
  name: 'normal_login'
})(NormalLoginForm)
