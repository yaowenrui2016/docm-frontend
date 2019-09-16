import React from 'react'
import {
  Layout,
  Select,
  Button,
  Table,
  Empty,
  message,
  Icon,
  Modal,
  Input,
  Form
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment'
import Http, { QueryResult, QueryRequest } from '../http'
import BaseVO from '../types'
import { toLine } from '../util'

const { Content } = Layout

type IProps = RouteComponentProps & {
  /**
   * 数据请求的路径
   */
  httpPath: string
  /**
   * 模型名称
   */
  modelName: string
}

interface IState {
  loading: boolean
  selectedRowKeys: string[] | number[]
  /**
   * 查询结果
   */
  data: QueryResult<BaseVO>
  pageSize: number | undefined
  current: number | undefined
  /**
   * 查询条件与排序
   */
  param: {
    conditions: any | undefined
    sorters: any | undefined
  }
  /**
   * 展现模态框形态：0-不展示 1-新建 2-编辑
   */
  modalFlag: number
  modalData: BaseVO | undefined
}

class List extends React.Component<IProps, IState> {
  form: React.ReactElement<FormProps> | undefined = undefined
  constructor(props: IProps) {
    super(props)
    this.state = {
      loading: true,
      selectedRowKeys: [],
      data: {
        total: undefined,
        content: []
      },
      pageSize: 10,
      current: 1,
      param: {
        conditions: {},
        sorters: {}
      },
      modalFlag: 0,
      modalData: undefined
    }
  }

  componentDidMount() {
    this.handleListChange()
  }

  handleListChange = () => {
    const { httpPath } = this.props
    this.setState({ loading: true }, () => {
      const { pageSize, current, param } = this.state
      const queryRequest: QueryRequest = {
        pageSize,
        current,
        ...param
      }
      Http.post(`${httpPath}/list`, queryRequest)
        .then(res => {
          this.setState({ loading: false, data: res.data.data })
        })
        .catch(error => {
          this.setState({ loading: false })
        })
    })
  }

  handleSelectChange = value => {
    const { conditions } = this.state.param
    conditions['keywords'] = value
    this.setState({ current: 1 })
    this.handleListChange()
  }

  handleDeleteOper = async (ids: Array<string> | Array<number>) => {
    const { httpPath } = this.props
    Modal.confirm({
      title: '确定删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        let queryString = ''
        ids.forEach(id => (queryString = queryString.concat(`ids=${id}&`)))
        Http.delete(
          `${httpPath}?${queryString.substring(0, queryString.length - 1)}`
        ).then(res => {
          if (res.data.status === '00000000') {
            message.success('删除成功')
            this.handleListChange()
          } else {
            message.error(res.data.message)
          }
        })
      }
    })
  }

  renderSearchBar() {
    const { modelName } = this.props
    return (
      <Select
        mode={'tags'}
        placeholder={`请输入${modelName}`}
        style={{ width: '280px' }}
        tokenSeparators={[' ']}
        showArrow={true}
        suffixIcon={<Icon style={{ fontSize: '16px' }} type="search" />}
        onChange={this.handleSelectChange}
        notFoundContent={null}
      />
    )
  }

  renderButtonBar() {
    const { selectedRowKeys } = this.state
    return (
      <div>
        <Button
          className="ele-operation"
          type="primary"
          onClick={event => {
            event.preventDefault()
            this.setState({ modalFlag: 1 })
          }}
        >
          新建
        </Button>
        <Button
          type="ghost"
          disabled={selectedRowKeys.length < 1}
          onClick={() => {
            this.handleDeleteOper(selectedRowKeys)
          }}
        >
          批量删除
        </Button>
      </div>
    )
  }

  buildColumns() {
    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => {
          return index + 1
        },
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '5%' }
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: 'center' } })
      },
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
        onHeaderCell: column => ({
          style: { textAlign: 'center' }
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: 'center' } })
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        render: (text, record, index) => {
          return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
        },
        sorter: (a, b) => {
          return a.id - b.id
        },
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '15%' }
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: 'center' } })
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record, index) => {
          return (
            <div>
              <Icon
                style={{ fontSize: '17px', margin: '0 9px 0 0' }}
                title={'编辑'}
                type="edit"
                onClick={event => {
                  event.preventDefault()
                  this.setState({ modalFlag: 2, modalData: record })
                }}
              />
              <div id="downloadDiv" style={{ display: 'none' }} />
              <Icon
                style={{ fontSize: '17px', margin: '0 9px 0 0' }}
                title={'删除'}
                type="delete"
                onClick={event => {
                  event.preventDefault()
                  this.handleDeleteOper([record.id])
                }}
              />
            </div>
          )
        },
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '12%' }
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: 'center' } })
      }
    ]
    return columns
  }

  renderTable() {
    const { loading, selectedRowKeys, data, pageSize, current } = this.state
    const { total, content } = data
    return loading || data.content.length > 0 ? (
      <Table
        rowKey={record => {
          return record.id
        }}
        rowSelection={{
          columnWidth: '30px',
          selectedRowKeys,
          onChange: selectedRowKeys => {
            this.setState({ selectedRowKeys })
          }
        }}
        columns={this.buildColumns()}
        dataSource={content}
        loading={loading}
        pagination={{
          total,
          current,
          pageSize,
          pageSizeOptions: ['10', '20', '50'],
          showSizeChanger: true,
          showTotal: total => {
            return `共 ${total} 条`
          }
        }}
        onChange={(pagination, filters, sorter, extra) => {
          const { param } = this.state
          const { current, pageSize } = pagination
          const { field, order } = sorter
          param.sorters = {}
          if (field && order) {
            param.sorters[toLine(field)] = fetchOrderDirection(order)
          }
          this.setState({ current, pageSize })
          this.handleListChange()
        }}
      />
    ) : (
      <Empty description={'暂无内容'} />
    )
  }

  handleOk = e => {
    e.preventDefault()
    const { httpPath } = this.props
    const { modalFlag } = this.state
    this.form &&
      this.form.props.form.validateFields((err, values) => {
        if (!err) {
          // 如果是新建则调用Http.put()方法,如果是编辑则调用Http.post()方法
          const method =
            modalFlag === 1 ? Http.put : modalFlag === 2 ? Http.post : undefined
          method &&
            method(`${httpPath}`, values)
              .then(res => {
                if (res.data.status === '00000000') {
                  message.success(`操作成功`)
                  this.handleListChange()
                } else {
                  message.error(res.data.message)
                }
              })
              .catch(err => {
                debugger
                message.error(err.response.data.msg)
              })
          this.setState({
            modalFlag: 0
          })
        }
      })
  }

  handleCancel = e => {
    this.setState({
      modalFlag: 0,
      modalData: undefined
    })
  }

  renderAddModal() {
    const { modalFlag, modalData } = this.state
    const title = `${
      modalFlag === 1 ? '新建' : modalFlag === 2 ? '编辑' : undefined
    }科室`
    return (
      <Modal
        title={title}
        visible={modalFlag > 0}
        okText={'提交'}
        cancelText={'取消'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <WrappedNormalForm
          wrappedComponentRef={(form: React.ReactElement<FormProps>) => {
            this.form = form
            if (this.form) {
              if (modalFlag === 2 && modalData) {
                // 编辑，设置值
                this.form.props.form.setFieldsValue({ ...modalData })
              } else if (modalFlag === 1) {
                // 新建，清除旧值
                this.form.props.form.resetFields(['id', 'name'])
              }
            }
          }}
        />
      </Modal>
    )
  }

  render() {
    return (
      <Content>
        <div className="list-page">
          <div className="list-page-content">
            <div className="list-page-content-toolbar">
              <div className="list-page-content-toolbar-search">
                {this.renderSearchBar()}
              </div>
              <div className="list-page-content-toolbar-button">
                {this.renderButtonBar()}
              </div>
            </div>
            <div className="list-page-content-table">{this.renderTable()}</div>
          </div>
        </div>
        <div>{this.renderAddModal()}</div>
      </Content>
    )
  }
}

function fetchOrderDirection(order: string) {
  if (order === 'descend') {
    return 'desc'
  } else {
    return 'asc'
  }
}

export default withRouter(List)

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

// const tailFormItemLayout = {
//   wrapperCol: {
//     xs: {
//       span: 2,
//       offset: 0
//     },
//     sm: {
//       span: 2,
//       offset: 4
//     }
//   }
// }

interface FormProps extends FormComponentProps {}

interface FormState {}

class NormalForm extends React.Component<FormProps, FormState> {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form {...formItemLayout}>
        {getFieldDecorator('id')(<Input hidden />)}
        <Form.Item key={'name'} label="名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: `请输入名称` }]
          })(<Input />)}
        </Form.Item>
      </Form>
    )
  }
}

const WrappedNormalForm = Form.create({
  name: 'normal_login'
})(NormalForm)
