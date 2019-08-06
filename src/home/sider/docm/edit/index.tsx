import React from 'react'
import {
  Layout,
  Button,
  Form,
  Input,
  Icon,
  Upload,
  DatePicker,
  message
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { UploadFile } from 'antd/lib/upload/interface'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment'
import IDocmVO from '../type'
import Http, { serverPath } from '../../../../common/http'
import { modulePath } from '../index'

const { Content } = Layout
const { MonthPicker } = DatePicker

type IProps = RouteComponentProps & {
  username: string
}

interface IState {
  mode: 'edit' | 'add' | undefined
  loading: boolean
  data: IDocmVO | undefined
  fileList: Array<UploadFile>
}

class Edit extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined = undefined
  constructor(props: IProps) {
    super(props)
    this.state = {
      mode: undefined,
      loading: true,
      data: undefined,
      fileList: []
    }
  }

  componentDidMount() {
    const { match } = this.props
    const id = match.params['id']
    const mode = id ? 'edit' : 'add'
    this.setState({ mode, loading: true }, () => {
      if (mode === 'edit') {
        Http.get(`/docm?id=${id}`)
          .then(res => {
            const data = res.data.data
            this.form &&
              this.form.props.form.setFieldsValue({
                ...data,
                contractTime: data.contractTime
                  ? moment(data.contractTime, 'YYYY-MM-DD')
                  : undefined,
                credentialTime: data.credentialTime
                  ? moment(data.credentialTime, 'YYYY-MM')
                  : undefined
              })
            const fileList = data.attachments.map(attachment => ({
              uid: attachment.id,
              size: 123,
              name: attachment.docName,
              type: 'image',
              status: 'done',
              response: {
                status: '00000000',
                data: [
                  {
                    docName: attachment.docName,
                    docPath: attachment.docPath
                  }
                ]
              }
            }))
            this.setState({ loading: false, fileList })
          })
          .catch(error => {})
      } else if (mode === 'add') {
        this.form && this.form.props.form.setFieldsValue({ attachments: [] })
        this.setState({ loading: false })
      }
    })
  }

  handleCancel = e => {
    e.preventDefault()
    this.props.history.push(`${modulePath}/list`)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.form &&
      this.form.props.form.validateFields((err, fielldValues) => {
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
          const { mode } = this.state
          const method =
            mode === 'add' ? Http.put : mode === 'edit' ? Http.post : undefined
          method &&
            method(`/docm`, values)
              .then(res => {
                this.props.history.push(`${modulePath}/list`)
              })
              .catch(err => {
                message.info(err.response.data.msg)
              })
        }
      })
  }

  renderContent() {
    const { mode, fileList } = this.state
    const setFieldsValue = this.form
      ? this.form.props.form.setFieldsValue
      : undefined
    return (
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
        <Form.Item key={'files'} label="上传附件">
          <Upload
            style={{ width: '100%' }}
            name="files"
            action={`${serverPath}/doc`}
            listType={'picture'}
            multiple={false}
            fileList={fileList}
            onChange={info => {
              const { fileList } = info
              const attachments = fileList
                .filter(file => {
                  return file.status === 'done'
                })
                .map(file => {
                  return {
                    docName: file.response.data[0]['docName'],
                    docPath: file.response.data[0]['docPath']
                  }
                })
              setFieldsValue && setFieldsValue({ attachments })
              this.setState({ fileList })
            }}
          >
            <Button block>
              <Icon type="upload" /> 请选择
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item key={'submit'} wrapperCol={{ span: 8, offset: 8 }}>
          <Button block type={'primary'} onClick={this.handleSubmit}>
            {mode === 'add' ? '提交' : '保存'}
          </Button>
        </Form.Item>
      </Form>
    )
  }

  render() {
    return (
      <Content>
        <div
          style={{
            margin: '4px 4px 10px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div style={{ margin: '4px', flex: 1 }}>
            <span style={{ float: 'right' }}>
              <Button type={'default'} onClick={this.handleCancel}>
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
          {this.renderContent()}
        </div>
      </Content>
    )
  }
}

export default withRouter(Edit)

interface FormProps extends FormComponentProps {}

interface FormState {
  defaultFileList: Array<any>
}

class NormalForm extends React.Component<FormProps, FormState> {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
        {getFieldDecorator('id')(<Input hidden />)}
        <Form.Item key={'projectName'} label="项目名称">
          {getFieldDecorator('projectName', {
            rules: [{ required: true, message: '请输入项目名称' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'projectType'} label="项目类型">
          {getFieldDecorator('projectType', {
            rules: [{ required: false, message: '请输入项目类型' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'company'} label="公司名称">
          {getFieldDecorator('company', {
            rules: [{ required: false, message: '请输入公司名称' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'contractNum'} label="合同号">
          {getFieldDecorator('contractNum', {
            rules: [{ required: false, message: '请输入合同号' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'contractTime'} label="合同签订时间">
          {getFieldDecorator('contractTime', {
            rules: [{ required: false, message: '请输入合同签订时间' }]
          })(<DatePicker format={'YYYY-MM-DD'} />)}
        </Form.Item>
        <Form.Item key={'credentialNum'} label="凭证号">
          {getFieldDecorator('credentialNum', {
            rules: [{ required: false, message: '请输入凭证号' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'credentialTime'} label="凭证时间">
          {getFieldDecorator('credentialTime', {
            rules: [{ required: false, message: '请输入凭证时间' }]
          })(<MonthPicker format={'YYYY-MM'} />)}
        </Form.Item>
        <Form.Item key={'money'} label="金额">
          {getFieldDecorator('money', {
            rules: [{ required: false, message: '请输入金额' }]
          })(<Input />)}
        </Form.Item>
        {getFieldDecorator('attachments')}
      </Form>
    )
  }
}

const WrappedNormalForm = Form.create({
  name: 'normal_login'
})(NormalForm)
