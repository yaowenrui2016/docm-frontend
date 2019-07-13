import React from 'react'
import {
  Layout,
  Breadcrumb,
  Button,
  Form,
  Input,
  Icon,
  message,
  Upload,
  // Modal,
  DatePicker
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { UploadFile } from 'antd/lib/upload/interface'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment'
import IDocmVO from '../type'
import Http, { serverPath } from '../../../../common/http/index'

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

class List extends React.Component<IProps, IState> {
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
    this.setState({ mode, loading: true }, async () => {
      if (mode === 'edit') {
        message.info('编辑')
        const data = (await Http.get(`/docm?id=${id}`)).data.data
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
      } else if (mode === 'add') {
        message.info('新建')
        this.form && this.form.props.form.setFieldsValue({ attachments: [] })
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
          const { mode } = this.state
          if (mode === 'add') {
            await Http.put('/docm', values)
          } else if (mode === 'edit') {
            await Http.post('/docm', values)
          }
          const { match } = this.props
          const path = match.path.replace('/edit', '/list')
          this.props.history.push(path)
        }
      })
  }

  render() {
    const { mode, fileList } = this.state
    const setFieldsValue = this.form
      ? this.form.props.form.setFieldsValue
      : undefined
    return (
      <Content>
        <Breadcrumb style={{ margin: '8px' }}>
          <Breadcrumb.Item>当前位置：</Breadcrumb.Item>
          <Breadcrumb.Item>我的项目</Breadcrumb.Item>
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
        </div>
      </Content>
    )
  }
}

export default withRouter(List)

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
