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
  Table,
  message
} from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import IDocmVO from '../type'
import {
  colLayout as customColLayout,
  singleRowFormItemLayout,
  formItemLayout,
  commonTableColumnProps
} from '../util'
import { FormComponentProps } from 'antd/lib/form'
import PayItemForm from './payItemForm'
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
  attachmentId: string | undefined
  showPayItemForm: boolean
}

class View extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      loading: true,
      data: {} as IDocmVO,
      fileList: [],
      attachmentId: undefined,
      showPayItemForm: false
    }
  }

  componentDidMount() {
    this.refreshPage()
  }

  refreshPage() {
    const { match } = this.props
    const id = match.params['id']
    this.setState({ loading: true, showPayItemForm: false }, () => {
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

  goBack = e => {
    e.preventDefault()
    this.props.history.push(`${modulePath}/list`)
  }

  renderToolBar() {
    return (
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
          <Button type={'default'} onClick={this.goBack}>
            返回
          </Button>
        </span>
      </div>
    )
  }

  handleDeletePayItem = async (ids: Array<string> | Array<number>) => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        let queryString = ''
        ids.forEach(id => (queryString = queryString.concat(`ids=${id}&`)))
        await Http.delete(
          `/docm/pay-item?${queryString.substring(0, queryString.length - 1)}`
        )
        message.success('删除成功')
        this.refreshPage()
      }
    })
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
      data,
      data: { payItems }
    } = this.state
    const columns = [
      {
        ...commonTableColumnProps,
        title: '序号',
        dataIndex: 'order',
        key: 'order',
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '3%' }
        })
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
      },
      {
        ...commonTableColumnProps,
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          return (
            <Button
              type={'link'}
              onClick={this.handleDeletePayItem.bind(this, [record.id])}
            >{`删除`}</Button>
          )
        }
      }
    ]
    let sum = 0
    payItems && payItems.forEach(item => (sum = sum + item.money))
    return !loading ? (
      <Table
        columns={columns}
        dataSource={payItems}
        size={'small'}
        bordered
        pagination={false}
        title={() => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h2>{`付款项`}</h2>
            </div>
            <div style={{ flex: 1 }}>
              <h4>{`合计：${sum}`}</h4>
            </div>
            <div style={{ flex: 1 }}>
              <h4>{`百分比：${(
                Math.round(((sum * 100) / data.money) * 100) / 100
              ).toFixed(2)}%`}</h4>
            </div>
            <div style={{ flex: 1 }}>
              <Button
                style={{ float: 'right' }}
                type={'ghost'}
                onClick={() => {
                  this.setState({ showPayItemForm: true })
                }}
              >
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

  form: React.ReactElement<FormComponentProps> | undefined = undefined
  handleSubmit = () => {
    this.form &&
      this.form.props.form.validateFields((errors, values) => {
        if (!errors) {
          console.log(values)
          Object.assign(values, { contractId: this.state.data.id })
          Http.put(`/docm/pay-item`, values)
            .then(res => {
              if (res.data.status === '00000000') {
                this.refreshPage()
                message.success('操作成功')
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
  handleCancel = () => {
    this.setState({ showPayItemForm: false })
  }

  renderPayItemModal() {
    const { showPayItemForm } = this.state
    return (
      <Modal
        title="添加付款项"
        visible={showPayItemForm}
        onCancel={this.handleCancel}
        onOk={this.handleSubmit}
      >
        <PayItemForm wrappedComponentRef={form => (this.form = form)} />
      </Modal>
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
          {this.renderToolBar()}
        </div>
        <div style={{ margin: '8px' }}>
          {this.renderContent()}
          {this.renderPayItem()}
        </div>
        <div>{this.renderPayItemModal()}</div>
      </Content>
    )
  }
}

export default withRouter(View)
