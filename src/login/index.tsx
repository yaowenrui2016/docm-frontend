import React from 'react'
import './index.css'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router-dom'

type IProps = RouteComponentProps & {}

interface IState {}

class Login extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined

  handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    this.form &&
      this.form.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          sessionStorage.setItem('userId', values.username)
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
          Log in
        </Button>
        Or <a href="/register">register now!</a>
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
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item className="last-ant-form-item">
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="/forgotpwd">
            Forgot password
          </a>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedNormalLoginForm = Form.create({
  name: 'normal_login'
})(NormalLoginForm)
