import React from 'react'
import {
  Layout,
  Button,
  Form,
  Input,
  Icon,
  Upload,
  DatePicker,
  message,
  Select
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
const { Option } = Select

type IProps = RouteComponentProps & {
  username: string
}

interface IState {
  mode: 'edit' | 'add' | undefined
  loading: boolean
  data: IDocmVO | undefined
  fileList: Array<UploadFile>
  deptData: Array<any>
  selectedDept: any
}

class Edit extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined = undefined
  constructor(props: IProps) {
    super(props)
    this.state = {
      mode: undefined,
      loading: true,
      data: undefined,
      fileList: [],
      deptData: [],
      selectedDept: undefined
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
            // 附件
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
            this.setState({
              loading: false,
              data,
              fileList,
              selectedDept: data.dept
            })
          })
          .catch(error => {})
      } else if (mode === 'add') {
        this.form && this.form.props.form.setFieldsValue({ attachments: [] })
        this.setState({ loading: false })
      }
      // 加载科室下拉选择器数据
      Http.post(`/dept/list-all`)
        .then(res => {
          this.setState({ deptData: res.data.data })
        })
        .catch(err => {})
    })
  }

  handleCancel = e => {
    e.preventDefault()
    this.props.history.push(`${modulePath}/list`)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.form &&
      this.form.props.form.validateFields((err, values) => {
        if (!err) {
          const params: IDocmVO = {
            ...values,
            contractTime: values['contractTime']
              ? values['contractTime'].format('YYYY-MM-DD')
              : undefined,
            credentialTime: values['credentialTime']
              ? values['credentialTime'].format('YYYY-MM')
              : undefined
          }
          const { mode } = this.state
          const method =
            mode === 'add' ? Http.put : mode === 'edit' ? Http.post : undefined
          method &&
            method(`/docm`, params)
              .then(res => {
                if (res.data.status === '00000000') {
                  this.props.history.push(`${modulePath}/list`)
                } else {
                  message.error(res.data.message)
                }
              })
              .catch(err => {
                message.info(err.response.data.msg)
              })
        }
      })
  }

  handleDeptOnChange = id => {
    const dept = { id }
    this.form &&
      this.form.props.form.setFieldsValue({
        dept
      })
    this.setState({ selectedDept: dept })
  }

  renderContent() {
    const { mode, fileList, deptData, selectedDept } = this.state
    const setFieldsValue = this.form
      ? this.form.props.form.setFieldsValue
      : undefined
    return (
      <Form {...formItemLayout}>
        <Form.Item key={'dept'} label="所属科室">
          <Select
            style={{ width: '100%' }}
            placeholder={'请选择'}
            value={selectedDept ? selectedDept.id : undefined}
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
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item key={'files'} label="上传附件">
          <Upload
            style={{ width: '100%' }}
            name="files"
            action={`${serverPath}/doc?xAuthToken=${sessionStorage.getItem(
              'xAuthToken'
            )}`}
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
        <Form.Item {...tailFormItemLayout} key={'submit'}>
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

interface FormState {}

class NormalForm extends React.Component<FormProps, FormState> {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form {...formItemLayout}>
        {getFieldDecorator('id')(<Input hidden />)}
        <Form.Item key={'projectName'} label="合同名称">
          {getFieldDecorator('projectName', {
            rules: [{ required: true, message: '请输入合同名称' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'projectType'} label="合同类型">
          {getFieldDecorator('projectType', {
            rules: [{ required: false, message: '请输入合同类型' }]
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
        {/** 所属科室 */}
        {getFieldDecorator('dept')}
        {/* 上传附件 */}
        {getFieldDecorator('attachments')}
      </Form>
    )
  }
}

const WrappedNormalForm = Form.create({
  name: 'normal_login'
})(NormalForm)
