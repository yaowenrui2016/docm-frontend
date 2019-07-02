import React from 'react'
import {
  Layout,
  Breadcrumb,
  Button,
  Form,
  Input,
  Icon,
  Upload,
  DatePicker
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router-dom'

const { Content } = Layout
const { MonthPicker } = DatePicker

type IProps = RouteComponentProps & {
  username: string
}

interface IState {
  loading: boolean
  value: any
}

class List extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined = undefined
  constructor(props: IProps) {
    super(props)
    this.state = {
      loading: true,
      value: {}
    }
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      this.setState({ loading: false })
    })
  }

  handleSearch = (value: string) => {
    console.log(value)
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
      this.form.props.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          const { match } = this.props
          const path = match.path.replace('/edit', '/list')
          this.props.history.push(path)
        }
      })
  }

  render() {
    const { value, loading } = this.state
    console.log(value)
    console.log(loading)
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index'
      },
      {
        title: '合同号',
        dataIndex: 'contractNum',
        key: 'contractNum'
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date'
      },
      {
        title: '备注',
        dataIndex: 'description',
        key: 'description'
      }
    ]
    console.log(columns)
    return (
      <Content
        style={{
          background: '#fff',
          margin: 0,
          minHeight: 280
        }}
      >
        <Breadcrumb style={{ margin: '8px' }}>
          <span>当前位置：</span>
          <Breadcrumb.Item>文档库</Breadcrumb.Item>
          <Breadcrumb.Item>文档管理</Breadcrumb.Item>
          <Breadcrumb.Item>新建</Breadcrumb.Item>
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
                关闭
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
          <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
            <Button block type={'primary'} onClick={this.handleSubmit}>
              提交
            </Button>
            <Button block type={'default'} onClick={this.handleCancel}>
              取消
            </Button>
          </Form.Item>
        </div>
      </Content>
    )
  }
}

export default withRouter(List)

interface FormProps extends FormComponentProps {
  username: string
  password: string
  onSubmit?: () => void
}

class NormalForm extends React.Component<FormProps, any> {
  normFile = e => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
        <Form.Item label="项目">
          {getFieldDecorator('project', {
            rules: [{ required: true, message: '请输入项目' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="合同号">
          {getFieldDecorator('contractNum', {
            rules: [{ required: true, message: '请输入合同号' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="公司">
          {getFieldDecorator('company', {
            rules: [{ required: true, message: '请输入公司' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="签订时间">
          {getFieldDecorator('contractDate', {
            rules: [{ required: true, message: '请输入签订时间' }]
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item label="所属凭证">
          {getFieldDecorator('credential', {
            rules: [{ required: true, message: '请输入凭证' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="凭证年月">
          {getFieldDecorator('credDate', {
            rules: [{ required: true, message: '请输入年月' }]
          })(<MonthPicker />)}
        </Form.Item>
        <Form.Item label="金额">
          {getFieldDecorator('money', {
            rules: [{ required: true, message: '请输入金额' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="文件上传">
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile
          })(
            <Upload
              style={{ width: '100%' }}
              name="myFile"
              action="http://localhost:8090/docm"
              listType="picture"
            >
              <Button block>
                <Icon type="upload" /> 请选择
              </Button>
            </Upload>
          )}
        </Form.Item>
      </Form>
    )
  }
}

const WrappedNormalForm = Form.create({
  name: 'normal_login'
})(NormalForm)
