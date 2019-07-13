import React from 'react'
import {
  Layout,
  Breadcrumb,
  Select,
  Button,
  Table,
  Empty,
  message,
  Icon,
  Modal
} from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment'
import IDocmVO from '../type'
import Http, { QueryResult, QueryRequest } from '../../../../common/http'
import { toLine } from '../../../../common/util'

const { Content } = Layout

type IProps = RouteComponentProps & {}

interface IState {
  loading: boolean
  selectedRowKeys: string[] | number[]
  /**
   * 查询结果
   */
  data: QueryResult<IDocmVO>
  pageSize: number | undefined
  current: number | undefined
  /**
   * 查询条件与排序
   */
  param: {
    conditions: any | undefined
    sorters: any | undefined
  }
}

class List extends React.Component<IProps, IState> {
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
      }
    }
  }

  componentDidMount() {
    this.handleListChange()
  }

  handleListChange = () => {
    this.setState({ loading: true }, async () => {
      const { pageSize, current, param } = this.state
      const queryRequest: QueryRequest = {
        pageSize,
        current,
        ...param
      }
      const res = await Http.post('/docm/list', queryRequest)
      this.setState({ loading: false, data: res.data.data })
    })
  }

  handleSelectChange = value => {
    const { conditions } = this.state.param
    conditions['keywords'] = value
    this.setState({ current: 1 })
    this.handleListChange()
  }

  handleDeleteOper = async (ids: Array<string> | Array<number>) => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        let queryString = ''
        ids.forEach(id => (queryString = queryString.concat(`ids=${id}&`)))
        await Http.delete(
          `/docm?${queryString.substring(0, queryString.length - 1)}`
        )
        message.success('删除成功')
        this.handleListChange()
      }
    })
  }

  render() {
    const { loading, selectedRowKeys, data, pageSize, current } = this.state
    const { total, content } = data
    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => {
          return index + 1
        }
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        key: 'projectName'
      },
      {
        title: '项目类型',
        dataIndex: 'projectType',
        key: 'projectType'
      },
      {
        title: '公司名称',
        dataIndex: 'company',
        key: 'company'
      },
      {
        title: '合同号',
        dataIndex: 'contractNum',
        key: 'contractNum'
      },
      {
        title: '合同签订时间',
        dataIndex: 'contractTime',
        key: 'contractTime',
        sorter: (a, b) => {
          return a.id - b.id
        }
      },
      {
        title: '凭证时间',
        dataIndex: 'credentialTime',
        key: 'credentialTime',
        sorter: (a, b) => {
          return a.id - b.id
        }
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
                onClick={() => {
                  const { match } = this.props
                  const path = match.path.replace('/list', `/edit/${record.id}`)
                  this.props.history.push(path)
                }}
              />
              <Icon
                style={{ fontSize: '17px', margin: '0 9px 0 0' }}
                title={'下载'}
                type="download"
                onClick={() => {
                  message.success('下载成功' + record.id)
                }}
              />
              <Icon
                style={{ fontSize: '17px', margin: '0 9px 0 0' }}
                title={'删除'}
                type="delete"
                onClick={() => this.handleDeleteOper([record.id])}
              />
            </div>
          )
        }
      }
    ]
    return (
      <Content>
        <Breadcrumb style={{ margin: '8px' }}>
          <Breadcrumb.Item>当前位置：</Breadcrumb.Item>
          <Breadcrumb.Item>我的项目</Breadcrumb.Item>
          <Breadcrumb.Item>查询</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            margin: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div style={{ margin: '4px', flex: 1 }}>
            <Select
              mode={'tags'}
              placeholder={'请输入关键字'}
              style={{ width: '280px' }}
              tokenSeparators={[' ']}
              showArrow={true}
              suffixIcon={<Icon style={{ fontSize: '16px' }} type="search" />}
              onChange={this.handleSelectChange}
              notFoundContent={null}
            />
          </div>
          <div style={{ margin: '4px', flex: 1 }}>
            <span style={{ float: 'right' }}>
              <Button
                className="ele-operation"
                type="primary"
                onClick={() => {
                  const { match } = this.props
                  const path = match.path.replace('/list', '/edit')
                  this.props.history.push(path)
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
            </span>
          </div>
        </div>
        <div style={{ margin: '8px' }}>
          {loading || data.content.length > 0 ? (
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
              columns={columns}
              dataSource={content}
              loading={loading}
              onRow={(record, index) => {
                return {
                  onClick: event => {
                    if (event.target['tagName'] !== 'TD') {
                      return
                    }
                    message.info('查看' + record.id)
                  }
                }
              }}
              size={'middle'}
              pagination={{
                total,
                current,
                pageSize,
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
          )}
        </div>
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