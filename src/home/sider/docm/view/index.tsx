import React from 'react'
import { Layout, Button, Form, Spin, Upload } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import IDocmVO from '../type'
import Http, { serverPath } from '../../../../common/http'
import { parentPath } from '../index'

const { Content } = Layout

type IProps = RouteComponentProps & {
  username: string
}

interface IState {
  loading: boolean
  data: IDocmVO | undefined
  fileList: Array<UploadFile>
}

class View extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      loading: true,
      data: undefined,
      fileList: []
    }
  }

  componentDidMount() {
    const { match } = this.props
    const id = match.params['id']
    this.setState({ loading: true }, () => {
      Http.get(`/docm?id=${id}`)
        .then(res => {
          const data = res.data.data
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
          this.setState({ loading: false, data, fileList })
        })
        .catch(error => {})
    })
  }

  handleCancel = e => {
    e.preventDefault()
    this.props.history.push(`${parentPath}/list`)
  }

  renderContent() {
    const { loading, data, fileList } = this.state
    return !loading && data ? (
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
        <Form.Item key={'projectName'} label="项目名称">
          {data.projectName}
        </Form.Item>
        <Form.Item key={'projectType'} label="项目类型">
          {data.projectType}
        </Form.Item>
        <Form.Item key={'company'} label="公司名称">
          {data.company}
        </Form.Item>
        <Form.Item key={'contractNum'} label="合同号">
          {data.contractNum}
        </Form.Item>
        <Form.Item key={'contractTime'} label="合同签订时间">
          {data.contractTime}
        </Form.Item>
        <Form.Item key={'credentialNum'} label="凭证号">
          {data.credentialNum}
        </Form.Item>
        <Form.Item key={'credentialTime'} label="凭证时间">
          {data.credentialTime}
        </Form.Item>
        <Form.Item key={'money'} label="金额">
          {data.money}
        </Form.Item>
        <Form.Item key={'files'} label="上传附件">
          <Upload
            style={{ width: '100%' }}
            name="files"
            action={`${serverPath}/doc`}
            listType={'picture'}
            multiple={false}
            fileList={fileList}
          />
        </Form.Item>
      </Form>
    ) : (
      <Spin size={'large'} />
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
              <Button
                className={'ele-operation'}
                type={'primary'}
                onClick={event => {
                  event.preventDefault()
                  const { match } = this.props
                  const id = match.params['id']
                  this.props.history.push(`${parentPath}/edit/${id}`)
                }}
              >
                编辑
              </Button>
              <Button type={'default'} onClick={this.handleCancel}>
                返回
              </Button>
            </span>
          </div>
        </div>
        <div style={{ margin: '8px' }}>{this.renderContent()}</div>
      </Content>
    )
  }
}

export default withRouter(View)
