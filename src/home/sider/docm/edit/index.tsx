import React from 'react'
import {
  Layout,
  Button,
  Form,
  Icon,
  Upload,
  message,
  Progress,
  Card,
  Avatar
} from 'antd'
import { createForm } from 'rc-form'
import $ from 'jquery'
import { UploadFile } from 'antd/lib/upload/interface'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'
import moment from 'moment'
import IDocmVO, { IAttachmentVO } from '../type'
import { singleRowFormItemLayout, formItemLayout } from '../util'
import Http, { serverPath } from '../../../../common/http'
import EditForm from './form'
import { modulePath } from '../index'
import './index.css'

const { Content } = Layout
const { Dragger } = Upload
const { Meta } = Card

type AttachFile = UploadFile & IAttachmentVO

type IProps = RouteComponentProps & {}

interface IState {
  mode: 'edit' | 'add' | undefined
  appConf: any
  loading: boolean
  data: IDocmVO | undefined
  fileList: Array<AttachFile>
  deptData: Array<any>
  selectedDept: any
  percent: any
  needFixed: boolean
}

class Edit extends React.Component<IProps, IState> {
  editForm: React.ReactElement<FormComponentProps> | undefined = undefined
  constructor(props: IProps) {
    super(props)
    this.state = {
      mode: undefined,
      appConf: {
        uploadFileMaxAmount: 20
      },
      loading: true,
      data: undefined,
      fileList: [],
      deptData: [],
      selectedDept: undefined,
      percent: 0,
      needFixed: false
    }
  }

  componentDidMount() {
    // 数据初始化
    this.initData()
    // 添加工具条滚动时的监听
    this.addToolBarScrollEventListener()
  }

  componentWillUnmount() {
    // 移除工具条滚动时的监听
    this.removeToolBarScrollEventListener()
  }

  initData() {
    const { match } = this.props
    const id = match.params['id']
    const mode = id ? 'edit' : 'add'
    this.setState({ mode, loading: true }, () => {
      // 编辑模式
      if (mode === 'edit') {
        Http.get(`/docm?id=${id}`)
          .then(res => {
            const data = res.data.data
            this.editForm &&
              this.editForm.props.form.setFieldsValue({
                ...data,
                contractTime: data.contractTime
                  ? moment(data.contractTime, 'YYYY-MM-DD')
                  : undefined,
                credentialTime: data.credentialTime
                  ? moment(data.credentialTime, 'YYYY-MM')
                  : undefined
              })
            // 处理附件集合
            const fileList: Array<AttachFile> = data.attachments.map(
              (attachment: IAttachmentVO) => ({
                uid: attachment.id,
                name: attachment.docName,
                docName: attachment.docName,
                docPath: attachment.docPath,
                type: attachment.type,
                size: attachment.size,
                status: 'done'
              })
            )
            this.setState({
              loading: false,
              data,
              fileList,
              selectedDept: data.dept
            })
          })
          .catch(error => {})
        // 新建模式
      } else if (mode === 'add') {
        this.editForm &&
          this.editForm.props.form.setFieldsValue({ attachments: [] })
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

  findToolBarElement = () => {
    const els = $('section.ant-layout')
    if (els.length === 3) {
      return els[2]
    }
    return undefined
  }

  handlerScroll(target) {
    const fixedTop = target.offsetTop
    const scrollTop = target.scrollTop
    //控制元素块A随鼠标滚动固定在顶部
    if (scrollTop >= fixedTop) {
      this.setState({ needFixed: true })
    } else if (scrollTop < fixedTop) {
      this.setState({ needFixed: false })
    }
  }

  addToolBarScrollEventListener = () => {
    const toolBarEle = this.findToolBarElement()
    toolBarEle &&
      toolBarEle.addEventListener(
        'scroll',
        this.handlerScroll.bind(this, toolBarEle)
      )
  }

  removeToolBarScrollEventListener = () => {
    const toolBarEle = this.findToolBarElement()
    toolBarEle &&
      toolBarEle.removeEventListener('scroll', () => {
        message.info('移除成功')
      })
  }

  handleCancel = e => {
    e.preventDefault()
    this.props.history.push(`${modulePath}/list`)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.editForm &&
      this.editForm.props.form.validateFields((err, values) => {
        if (!err) {
          const { fileList } = this.state
          const params: IDocmVO = {
            ...values,
            contractTime: values['contractTime']
              ? values['contractTime'].format('YYYY-MM-DD')
              : undefined,
            credentialTime: values['credentialTime']
              ? values['credentialTime'].format('YYYY-MM')
              : undefined,
            // 上传的附件，需要状态为'done'的附件
            attachments: fileList
              .filter(file => {
                return file.status === 'done'
              })
              .map(file => ({
                docPath: file.docPath,
                docName: file.docName,
                type: file.type,
                size: file.size,
                md5: file.md5
              }))
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

  updateFileUploadByResponse = (uid, info) => {
    const { fileList } = this.state
    const targetFile = fileList.find(file => {
      return file.uid === uid
    })
    targetFile && Object.assign(targetFile, info)
    this.setState({ fileList })
  }

  updateFileUploadStatus = (uid, status) => {
    const { fileList } = this.state
    const targetFile = fileList.find(file => {
      return file.uid === uid
    })
    targetFile && (targetFile['status'] = status)
    this.setState({ fileList })
  }

  updateFileUploadProgress = (uid, percent) => {
    const { fileList } = this.state
    const targetFile = fileList.find(file => {
      return file.uid === uid
    })
    targetFile && (targetFile['percent'] = percent)
    this.setState({ fileList })
  }

  addFileUpload = file => {
    let { fileList } = this.state
    fileList = fileList.concat({
      uid: file.uid,
      size: file.size,
      name: file.name,
      type: file.type,
      status: 'uploading',
      docName: '',
      docPath: '',
      md5: ''
    })
    this.setState({ fileList })
  }

  handleCustomUpload = obj => {
    const { file } = obj
    const { name } = file
    // 校验支持的文件类型
    if (!/.+(\.pdf)|(\.docx)|(\.xlsx)|(\.jpg)|(\.png)$/.test(name)) {
      message.error('不支持的文件类型')
      return
    }
    this.addFileUpload(file)
    const formData = new FormData()
    formData.append('files', file)
    $.ajax({
      url: `${serverPath}/doc?xAuthToken=${sessionStorage.getItem(
        'xAuthToken'
      )}`,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false,
      timeout: 60000,
      xhr: () => {
        const xhr = new XMLHttpRequest()
        if (xhr.upload) {
          xhr.upload.addEventListener(
            'progress',
            e => {
              if (e.lengthComputable) {
                const percent = Math.floor((e.loaded / e.total) * 100)
                this.updateFileUploadProgress(file.uid, percent)
              }
            },
            false
          )
        }
        return xhr
      },
      success: res => {
        // 设置path和name
        const { name, ...attachmentInfo } = res.data[0]
        res.status === '00000000' &&
          res.data &&
          this.updateFileUploadByResponse(file.uid, attachmentInfo)
        // 定时1.5秒后隐藏进度条
        setTimeout(() => {
          this.updateFileUploadStatus(file.uid, 'done')
        }, 1500)
      },
      error: err => {
        if (err.status === 403) {
          message.error(`您没有上传权限`)
        } else {
          message.error(`${file.name} 上传失败`)
        }
      }
    })
  }

  showAttachmentList() {
    return this.state.fileList.map(file => {
      return (
        <Card key={file.uid} size={'small'} style={{ marginTop: '8px' }}>
          <Meta
            title={
              <div>
                <div style={{ display: 'flex' }}>
                  <p
                    style={{
                      flexGrow: 1,
                      overflow: 'hidden',
                      width: '200px'
                    }}
                  >
                    {file.name}
                  </p>
                  <div style={{ flexGrow: 0.1 }}>
                    <Button
                      type={'link'}
                      style={{
                        float: 'right',
                        color: 'gray'
                      }}
                      onClick={() => {
                        const { fileList } = this.state
                        const len = fileList.length
                        for (let i = 0; i < len; i++) {
                          if (fileList[i].uid === file.uid) {
                            fileList.splice(i, 1)
                            break
                          }
                        }
                        this.setState({ fileList })
                      }}
                    >
                      <Icon type={'delete'} />
                    </Button>
                  </div>
                </div>
                <div style={{ color: 'gray' }}>{`${file.size} Byte`}</div>
                {file.status !== 'done' && <Progress percent={file.percent} />}
              </div>
            }
            avatar={<Avatar shape={'square'} size={'large'} icon={'file'} />}
          />
        </Card>
      )
    })
  }

  renderForm = () => {
    const {
      fileList,
      appConf: { uploadFileMaxAmount }
    } = this.state
    return (
      <div>
        <EditForm wrappedComponentRef={form => (this.editForm = form)} />
        <Form {...formItemLayout}>
          <Form.Item {...singleRowFormItemLayout} key={'upload'} label={'附件'}>
            {fileList.length >= uploadFileMaxAmount ? null : (
              <Dragger
                accept={'.pdf,.docx,.xlsx,.jpg,.png'}
                name={'files'}
                multiple={true}
                showUploadList={false}
                customRequest={this.handleCustomUpload}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持的文件类型为pdf、docx、xlsx、jpg和png，且最多20个附件
                </p>
              </Dragger>
            )}
            {this.showAttachmentList()}
          </Form.Item>
        </Form>
      </div>
    )
  }

  render() {
    const { mode } = this.state
    return (
      <Content>
        <div className={`tool-bar ${this.state.needFixed ? 'fixed' : ''}`}>
          <div className="tool-bar-item"></div>
          <div className="tool-bar-item"></div>
          <div className="tool-bar-item">
            <div className="tool-bar" style={{ float: 'right' }}>
              <div className="tool-bar-item">
                <Button block type={'primary'} onClick={this.handleSubmit}>
                  {mode === 'add' ? '提交' : '保存'}
                </Button>
              </div>
              <div className="tool-bar-item">
                <Button type={'default'} onClick={this.handleCancel}>
                  返回
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ margin: '8px' }}>{this.renderForm()}</div>
      </Content>
    )
  }
}

const ContractForm = createForm({
  name: 'form'
})(Edit)

export default withRouter(ContractForm)
