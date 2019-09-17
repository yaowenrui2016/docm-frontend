import React from 'react'
import { Form, Icon, Input, Button, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Http from '../common/http/index'
import md5 from 'js-md5'
import img from '../assert/img/login_3.jpg'
import Logo from '../assert/svg/Logo.svg'
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
          await Http.post(`/account/login`, { ...values, password })
            .then(res => {
              if (res.data.status === '00000000') {
                sessionStorage.setItem('userId', res.data.data.id)
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
      <div className="login">
        <img className="login-img" src={img} alt="" />
        <div className="login-form">
          <div className="login-form-top">
            <div className="logo">
              <a href="/">
                <img className="logo-img" src={Logo} alt="logo" />
                <span className="logo-text">Contract MS</span>
              </a>
            </div>
            <div className="logo-desc">欢迎登录合同管理系统</div>
          </div>
          <WrappedNormalLoginForm
            wrappedComponentRef={(form: React.ReactElement<FormProps>) => {
              this.form = form
            }}
          />
          <Button
            className="login-form-item"
            type="primary"
            onClick={this.handleSubmit}
          >
            登录
          </Button>
        </div>
        <div className="copyright"></div>
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
      <Form layout={'vertical'}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }]
          })(
            <Input
              className="login-form-item"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }]
          })(
            <Input
              className="login-form-item"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
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
