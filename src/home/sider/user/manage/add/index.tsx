import React from 'react'
import { Layout, Button, Form, Input, message, Select, TreeSelect } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import IAccountVO from '../type'
import Http from '../../../../../common/http'
import md5 from 'js-md5'
import { manageSiderPath } from '../../index'

const { Content } = Layout
const { Option } = Select

type IProps = RouteComponentProps & {}

interface IState {
  treeData: Array<any>
  permissions: Array<any>
  deptData: Array<any>
}

class Add extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined = undefined
  constructor(props) {
    super(props)
    this.state = {
      treeData: [],
      permissions: [],
      deptData: []
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
    Http.post(`/dept/list-all`)
      .then(res => {
        this.setState({ deptData: res.data.data })
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
      this.form.props.form.validateFields((err, values) => {
        if (!err) {
          const params: IAccountVO = {
            ...values,
            password: md5(values.password ? values.password : '1234'),
            dept: {
              id: values.dept
            }
          }
          Http.put('/user', params)
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

  handleDeptOnChange = dept => {
    this.form &&
      this.form.props.form.setFieldsValue({
        dept
      })
  }

  render() {
    const { treeData, permissions, deptData } = this.state
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
          <Form {...formItemLayout}>
            <Form.Item key={'dept'} label="所属科室">
              <Select
                style={{ width: '100%' }}
                placeholder={'请选择'}
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                onChange={this.handleDeptOnChange}
              >
                {deptData.map(dept => (
                  <Option value={dept.id}>{dept.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item key={'permissions'} label="账号授权">
              <TreeSelect
                style={{ width: '100%' }}
                searchPlaceholder={'请选择'}
                multiple={true}
                showSearch={false}
                treeData={treeData}
                value={permissions}
                treeCheckable={true}
                onChange={this.handlePermOnChange}
              />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button block type={'primary'} onClick={this.handleSubmit}>
                {'提交'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    )
  }
}

export default withRouter(Add)

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

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 2,
      offset: 0
    },
    sm: {
      span: 2,
      offset: 4
    }
  }
}

interface FormProps extends FormComponentProps {}

interface FormState {
  defaultFileList: Array<any>
}

class NormalForm extends React.Component<FormProps, FormState> {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form {...formItemLayout}>
        {getFieldDecorator('id')(<Input hidden />)}
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
                validator: async (rule, value, callback, source, options) => {
                  await Http.get(`/user/cku-username?username=${value}`)
                    .then(res => {
                      if (res.data.status === '00000000') {
                        const cku = res.data.data === true ? true : undefined
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
        {/** 所属科室 */}
        {getFieldDecorator('dept')}
        {/** 账号授权 */}
        {getFieldDecorator('permissions')}
      </Form>
    )
  }
}

const WrappedNormalForm = Form.create({
  name: 'normal_login'
})(NormalForm)
