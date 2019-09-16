import React from 'react'
import { Layout, Button, Form, Input, message, Select, TreeSelect } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import IAccountVO from '../type'
import Http from '../../../../../common/http'
import { manageSiderPath } from '../../index'

const { Content } = Layout
const { Option } = Select

type IProps = RouteComponentProps & {}

interface IState {
  loading: boolean
  /**
   * 用户id
   */
  id: string
  /**
   * 权限选择器备选数据
   */
  treeData: Array<any>
  /**
   * 用户拥有权限的id，赋值给权限选择器，显示用
   */
  permissions: Array<any>
  /**
   * 科室选择器备选数据
   */
  deptData: Array<any>
  /**
   * 用户所属科室的id，赋值给科室选择器，显示用
   */
  dept: string
}

class Edit extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined = undefined
  constructor(props: IProps) {
    super(props)
    this.state = {
      id: this.props.match.params['id'],
      loading: true,
      treeData: [],
      permissions: [],
      deptData: [],
      dept: ''
    }
  }

  componentDidMount() {
    const { id } = this.state
    this.setState({ loading: true }, () => {
      Http.get(`/user?id=${id}`)
        .then(res => {
          const data = res.data.data
          const dept = data.dept ? data.dept.id : undefined
          this.form &&
            this.form.props.form.setFieldsValue({
              ...data,
              dept
            })
          const permissions = data.permissions.map(perm => perm.id)
          this.setState({ loading: false, permissions, dept })
        })
        .catch(error => {
          this.setState({ loading: false })
        })
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
    })
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
            dept: {
              id: values.dept
            }
          }
          Http.post('/user', params)
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
    this.setState({ dept })
  }

  render() {
    const { loading, treeData, permissions, deptData, dept } = this.state
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
                value={dept}
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
                treeData={treeData}
                value={permissions}
                treeCheckable={true}
                onChange={this.handlePermOnChange}
              />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button
                block
                type={'primary'}
                loading={loading}
                onClick={this.handleSubmit}
              >
                {'保存'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    )
  }
}

export default withRouter(Edit)

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
    const { getFieldDecorator, getFieldValue } = this.props.form
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
                  const id = getFieldValue('id')
                  await Http.get(
                    `/user/check-unique-username?username=${value}&id=${id}`
                  )
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
        {/** 角色授权 */}
        {getFieldDecorator('permissions')}
      </Form>
    )
  }
}

const WrappedNormalForm = Form.create({
  name: 'normal_login'
})(NormalForm)
