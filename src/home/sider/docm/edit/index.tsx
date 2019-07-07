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
import IDocmVO from '../type'
import Http from '../../../../common/http/index'

const { Content } = Layout
const { MonthPicker } = DatePicker

type IProps = RouteComponentProps & {
  username: string
}

interface IState {
  loading: boolean
  data: IDocmVO | undefined
}

class List extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined = undefined
  constructor(props: IProps) {
    super(props)
    this.state = {
      loading: true,
      data: undefined
    }
  }

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      const { match } = this.props
      debugger
      if (match.path.indexOf('edit') > 0) {
        const data = (await Http.get(`/docm?id=${match.params['id']}`)).data
          .data
        this.form &&
          this.form.props.form.setFieldsValue({
            projectName: data.projectName
          })
        this.setState({ loading: false })
      }
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
          const values: IDocmVO = {
            ...fielldValues,
            contractTime: fielldValues['contractTime']
              ? fielldValues['contractTime'].format('YYYY-MM-DD')
              : undefined,
            credentialTime: fielldValues['credentialTime']
              ? fielldValues['credentialTime'].format('YYYY-MM')
              : undefined
          }
          console.log(values)
          const res = await Http.put('/docm', values)
          console.log(res)
          const { match } = this.props
          const path = match.path.replace('/edit', '/list')
          this.props.history.push(path)
        }
      })
  }

  render() {
    return (
      <Content>
        <Breadcrumb style={{ margin: '8px' }}>
          <Breadcrumb.Item>当前位置：</Breadcrumb.Item>
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
          <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
            <Button block type={'primary'} onClick={this.handleSubmit}>
              提交
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
        <Form.Item key={'projectName'} label="项目名称">
          {getFieldDecorator('projectName', {
            rules: [{ required: true, message: '请输入项目' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'projectType'} label="项目类型">
          {getFieldDecorator('projectType', {
            rules: [{ required: false, message: '请输入项目' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'company'} label="公司名称">
          {getFieldDecorator('company', {
            rules: [{ required: false, message: '请输入公司' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'contractNum'} label="合同号">
          {getFieldDecorator('contractNum', {
            rules: [{ required: false, message: '请输入合同号' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'contractTime'} label="合同签订时间">
          {getFieldDecorator('contractTime', {
            rules: [{ required: false, message: '请输入签订时间' }]
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item key={'credentialNum'} label="凭证号">
          {getFieldDecorator('credentialNum', {
            rules: [{ required: false, message: '请输入凭证' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'credentialTime'} label="凭证时间">
          {getFieldDecorator('credentialTime', {
            rules: [{ required: false, message: '请输入年月' }]
          })(<MonthPicker />)}
        </Form.Item>
        <Form.Item key={'money'} label="金额">
          {getFieldDecorator('money', {
            rules: [{ required: false, message: '请输入金额' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'docName'} label="文件上传">
          {getFieldDecorator('docName', {
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
