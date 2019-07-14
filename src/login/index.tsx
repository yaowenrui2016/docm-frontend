import React from 'react'
import { Form, Icon, Input, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Http from '../common/http/index'
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
          const res = (await Http.post('/login', values)).data
          console.log(res)
          debugger
          const userInfo = res.data
          sessionStorage.setItem('userInfo', userInfo)
          this.props.history.push('/main')
        }
      })
  }

  render() {
    return (
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
