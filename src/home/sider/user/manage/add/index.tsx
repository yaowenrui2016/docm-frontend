import React from 'react'
import {
  Layout,
  Button,
  Form,
  Input,
  message,
  Col,
  Row,
  TreeSelect
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import IAccountVO from '../type'
import Http from '../../../../../common/http'
import md5 from 'js-md5'
import { manageSiderPath } from '../../index'

const { Content } = Layout

type IProps = RouteComponentProps & {}

interface IState {
  treeData: Array<any>
  permissions: Array<any>
}

class Add extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined = undefined
  constructor(props) {
    super(props)
    this.state = {
      treeData: [],
      permissions: []
    }
  }

  componentDidMount() {
    Http.get(`/perm/all`)
      .then(res => {
        const treeData = res.data.data.map((v, index) => {
          return {
            key: index,
            title: v.group,
            value: undefined,
            children: v.permissions.map(perm => {
              return {
                key: perm.id,
                title: perm.name,
                value: perm.id
              }
            })
          }
        })
        this.setState({ treeData })
      })
      .catch(err => {})
  }

  handleCancel = e => {
    e.preventDefault()
    this.props.history.push(`${manageSiderPath}/list`)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.form &&
      this.form.props.form.validateFields((err, fielldValues) => {
        if (!err) {
          const values: IAccountVO = {
            ...fielldValues,
            password: md5(
              fielldValues.password ? fielldValues.password : '1234'
            )
          }
          Http.put('/user', values)
            .then(res => {
              if (res.data.status === '00000000') {
                this.props.history.push(`${manageSiderPath}/list`)
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

  handlePermOnChange = permissions => {
    this.form &&
      this.form.props.form.setFieldsValue({
        permissions: permissions.map(perm => ({ id: perm }))
      })
    this.setState({ permissions })
  }

  render() {
    const { treeData, permissions } = this.state
    return (
      <Content>
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
            <Col span={16} offset={4}>
              <Form.Item key={'permissions'} label="账号授权">
                <TreeSelect
                  style={{ width: '100%' }}
                  searchPlaceholder={'请选择权限'}
                  multiple={true}
                  treeData={treeData}
                  value={permissions}
                  treeCheckable={true}
                  onChange={this.handlePermOnChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={60}>
            <Col span={3} offset={9}>
              <Button block type={'primary'} onClick={this.handleSubmit}>
                {'提交'}
              </Button>
            </Col>
            <Col span={3}>
              <Button block onClick={this.handleCancel}>
                {'取消'}
              </Button>
            </Col>
          </Row>
        </div>
      </Content>
    )
  }
}

export default withRouter(Add)

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
                    type: 'string',
                    pattern: /^[a-zA-Z][a-zA-Z0-9_]{2,11}$/,
                    message: '用户名为3~12位字母、数字或下划线,第一位必须为字母'
                  },
                  {
                    message: '用户名已存在',
                    validator: async (
                      rule,
                      value,
                      callback,
                      source,
                      options
                    ) => {
                      await Http.get(`/user/cku-username?username=${value}`)
                        .then(res => {
                          if (res.data.status === '00000000') {
                            const cku =
                              res.data.data === true ? true : undefined
                            callback(cku)
                          } else {
                            message.error(res.data.message)
                            callback()
                          }
                        })
                        .catch(err => {
                          message.error('服务器异常')
                          callback()
                        })
                    }
                  }
                ],
                validateTrigger: 'onBlur'
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item key={'password'} label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: false,
                    message: '密码为4~16位任意字符',
                    pattern: /^.{4,16}$/
                  }
                ],
                validateTrigger: 'onBlur'
              })(<Input type={'password'} placeholder={'默认密码为1234'} />)}
            </Form.Item>
          </Col>
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
        {/** 角色授权 */}
        {getFieldDecorator('permissions')}
      </Form>
    )
  }
}

const WrappedNormalForm = Form.create({
  name: 'normal_login'
})(NormalForm)
