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
   * 新建modal框
   */
  showAddModal: boolean
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
      showAddModal: false
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
      onOk: async () => {
        let queryString = ''
        ids.forEach(id => (queryString = queryString.concat(`ids=${id}&`)))
        await Http.delete(
          `${httpPath}?${queryString.substring(0, queryString.length - 1)}`
        )
        message.success('删除成功')
        this.handleListChange()
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
            this.setState({ showAddModal: true })
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
        }
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record, index) => {
          return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
        },
        sorter: (a, b) => {
          return a.id - b.id
        }
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
                  this.setState({ showAddModal: true })
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
        }
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
          selectedRowKeys,
          onChange: selectedRowKeys => {
            this.setState({ selectedRowKeys })
          }
        }}
        columns={this.buildColumns()}
        dataSource={content}
        loading={loading}
        onRow={(record, index) => {
          return {
            onClick: event => {
              event.preventDefault()
              if (event.target['tagName'] !== 'TD') {
                return
              }
              this.setState({ showAddModal: true })
            }
          }
        }}
        // size={'middle'}
        pagination={{
          total,
          current,
          pageSize,
          pageSizeOptions: ['10', '20', '50'],
          showSizeChanger: true,
          showTotal: total => {
            return `共${total}条`
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
    this.form &&
      this.form.props.form.validateFields((err, values) => {
        if (!err) {
          Http.put(`${httpPath}`, values)
            .then(res => {
              message.success(`操作成功`)
              this.handleListChange()
            })
            .catch(err => {
              message.info(err.response.data.msg)
            })
          this.setState({
            showAddModal: false
          })
        }
      })
  }

  handleCancel = e => {
    console.log(e)
    this.setState({
      showAddModal: false
    })
  }

  renderAddModal() {
    const { showAddModal } = this.state
    return (
      <Modal
        title="新建"
        visible={showAddModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <WrappedNormalForm
          wrappedComponentRef={(form: React.ReactElement<FormProps>) => {
            this.form = form
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

interface FormProps extends FormComponentProps {}

interface FormState {}

class NormalForm extends React.Component<FormProps, FormState> {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
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
