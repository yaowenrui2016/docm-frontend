import React from 'react'
import {
  Layout,
  Button,
  Form,
  Spin,
  Upload,
  Modal,
  Row,
  Col,
  Table
} from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import IDocmVO from '../type'
import PreView from '../preview'
import {
  colLayout as customColLayout,
  singleRowFormItemLayout,
  formItemLayout,
  commonTableColumnProps
} from '../util'
import Http from '../../../../common/http'
import { modulePath } from '../index'
import './index.css'

const { Content } = Layout
const colLayout = {
  ...customColLayout,
  style: { height: '48px' }
}

type IProps = RouteComponentProps & {}

interface IState {
  loading: boolean
  data: IDocmVO
  fileList: Array<UploadFile>
  showPreview: boolean
  attachmentId: string | undefined
}

class View extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      loading: true,
      data: {} as IDocmVO,
      fileList: [],
      showPreview: false,
      attachmentId: undefined
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
    this.props.history.push(`${modulePath}/list`)
  }

  renderContent() {
    const { loading, data, fileList } = this.state
    return !loading && data ? (
      <Form {...formItemLayout}>
        <Row gutter={10}>
          <Col {...colLayout}>
            <Form.Item key={'projectName'} label="合同名称">
              {data.projectName}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item key={'dept'} label="所属科室">
              {data.dept ? data.dept.name : ''}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col {...colLayout}>
            <Form.Item key={'company'} label="乙方名称">
              {data.company}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item key={'projectType'} label="合同类型">
              {data.projectType}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col {...colLayout}>
            <Form.Item key={'contractNum'} label="中标编号">
              {data.contractNum}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item key={'contractTime'} label="合同签订时间">
              {data.contractTime}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col {...colLayout}>
            <Form.Item key={'money'} label="金额">
              {data.money}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item key={'description'} label={'备注'}>
              {data.desc}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item {...singleRowFormItemLayout} key={'upload'} label={'附件'}>
          <Upload
            fileList={fileList}
            listType={'text'}
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
            onPreview={file => {
              this.setState({ showPreview: true, attachmentId: file.uid })
            }}
          />
        </Form.Item>
      </Form>
    ) : (
      <Spin size={'large'} />
    )
  }

  renderPayItem() {
    const {
      loading,
      data: { payItems }
    } = this.state
    const columns = [
      {
        ...commonTableColumnProps,
        title: '序号',
        key: 'index'
      },
      {
        ...commonTableColumnProps,
        title: '金额',
        dataIndex: 'money',
        key: 'money'
      },
      {
        ...commonTableColumnProps,
        title: '凭证号',
        dataIndex: 'credentialNum',
        key: 'credentialNum'
      },
      {
        ...commonTableColumnProps,
        title: '凭证时间',
        dataIndex: 'credentialTime',
        key: 'credentialTime'
      },
      {
        ...commonTableColumnProps,
        title: '合同号',
        dataIndex: 'contractNum',
        key: 'contractNum'
      },
      {
        ...commonTableColumnProps,
        title: '备注',
        dataIndex: 'desc',
        key: 'desc'
      }
    ]
    return !loading ? (
      <Table
        columns={columns}
        dataSource={payItems}
        bordered
        title={() => (
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <h2>{`付款项`}</h2>
            </div>
            <div style={{ flex: 1 }}>
              <Button style={{ float: 'right' }} type={'ghost'}>
                添加
              </Button>
            </div>
          </div>
        )}
      />
    ) : (
      <Spin size={'large'} />
    )
  }

  render() {
    const { attachmentId } = this.state
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
                  this.props.history.push(`${modulePath}/edit/${id}`)
                }}
              >
                编辑
              </Button>
              <Button type={'default'} onClick={this.handleCancel}>
                返回
              </Button>
            </span>
          </div>
          <div>
            <Modal
              title="预览"
              visible={this.state.showPreview}
              onCancel={() => {
                this.setState({ showPreview: false })
              }}
            >
              <h2>hehe</h2>
              {attachmentId && <PreView docmId={attachmentId} />}
            </Modal>
          </div>
        </div>
        <div style={{ margin: '8px' }}>
          {this.renderContent()}
          {this.renderPayItem()}
        </div>
      </Content>
    )
  }
}

export default withRouter(View)
