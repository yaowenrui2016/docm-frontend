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
  Tabs
} from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment'
import IAccountVO, { IDeptVO } from '../type'
import DeptList from '../../../../../common/simplelist/index'
import Http, { QueryResult, QueryRequest } from '../../../../../common/http'
import { toLine } from '../../../../../common/util'
import { manageSiderPath } from '../../index'
import './index.css'

const { Content } = Layout
const { Option } = Select
const { TabPane } = Tabs

type IProps = RouteComponentProps & {}

interface IState {
  loading: boolean
  deptData: Array<IDeptVO>
  selectedRowKeys: string[] | number[]
  /**
   * 查询结果
   */
  data: QueryResult<IAccountVO>
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
      deptData: [],
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
    this.loadDeptData()
    this.handleListChange()
  }

  handleListChange = () => {
    this.setState({ loading: true }, () => {
      const { pageSize, current, param } = this.state
      const queryRequest: QueryRequest = {
        pageSize,
        current,
        ...param
      }
      Http.post(`/user/list`, queryRequest)
        .then(res => {
          this.setState({ loading: false, data: res.data.data })
        })
        .catch(error => {
          this.setState({ loading: false })
        })
    })
  }

  loadDeptData = () => {
    this.setState({ loading: true }, () => {
      Http.post(`/dept/list-all`)
        .then(res => {
          this.setState({ loading: false, deptData: res.data.data })
        })
        .catch(error => {
          this.setState({ loading: false })
        })
    })
  }

  handleSelectChangeForKeyword = value => {
    const { conditions } = this.state.param
    conditions['keywords'] = value
    this.setState({ current: 1 })
    this.handleListChange()
  }

  handleSelectChangeForDept = value => {
    const { conditions } = this.state.param
    conditions['dept'] = { id: value }
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
          `/user?${queryString.substring(0, queryString.length - 1)}`
        )
        message.success('删除成功')
        this.handleListChange()
      }
    })
  }

  // renderAside() {
  //   const { deptData } = this.state
  //   const treeData =
  //     deptData.length > 1
  //       ? deptData.map(dept => ({ title: dept['name'], key: dept['id'] }))
  //       : undefined
  //   return (
  //     <div>
  //       <div className="layout-content-aside-wrapper">
  //         <div className="layout-content-aside-wrapper-search">
  //           <Select
  //             mode="default"
  //             placeholder={'搜索科室'}
  //             style={{ width: '100%' }}
  //             showArrow={false}
  //             showSearch
  //           />
  //         </div>
  //         <div className="layout-content-aside-wrapper-btn">
  //           <Button
  //             type="primary"
  //             onClick={event => {
  //               event.preventDefault()
  //               this.props.history.push(`${manageSiderPath}/add`)
  //             }}
  //           >
  //             新建
  //           </Button>
  //         </div>
  //       </div>
  //       <Tree treeData={treeData} showLine />
  //     </div>
  //   )
  // }

  renderKeywordSearchBar() {
    return (
      <Select
        mode={'tags'}
        placeholder={'请输入用户名、手机号或邮箱'}
        style={{ width: '280px', marginRight: '24px' }}
        tokenSeparators={[' ']}
        showArrow={true}
        suffixIcon={<Icon style={{ fontSize: '16px' }} type="search" />}
        onChange={this.handleSelectChangeForKeyword}
        notFoundContent={null}
      />
    )
  }

  renderDeptSearchBar() {
    const { deptData } = this.state
    return (
      <span>
        <label>所属科室：</label>
        <Select
          placeholder={'请选择'}
          style={{ width: '280px' }}
          allowClear
          showArrow={true}
          onChange={this.handleSelectChangeForDept}
        >
          {deptData.map(dept => (
            <Option value={dept.id}>{dept.name}</Option>
          ))}
        </Select>
      </span>
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
            this.props.history.push(`${manageSiderPath}/add`)
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
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        onHeaderCell: column => ({
          style: { textAlign: 'center' }
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: 'center' } })
      },
      {
        title: '手机',
        dataIndex: 'phone',
        key: 'phone',
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '16%' }
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: 'center' } })
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '20%' }
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: 'center' } })
      },
      {
        title: '冻结状态',
        dataIndex: 'frozen',
        key: 'frozen',
        render: (text, record, index) => {
          return record.frozen ? '已冻结' : '正常'
        },
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '6%' }
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: 'center' } })
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
                  this.props.history.push(
                    `${manageSiderPath}/edit/${record.id}`
                  )
                }}
              />
              <Icon
                style={{ fontSize: '17px', margin: '0 9px 0 0' }}
                title={record.frozen ? '解冻' : '冻结'}
                type={record.frozen ? 'lock' : 'unlock'}
                onClick={event => {
                  event.preventDefault()
                  const operation = record.frozen ? 'unfreeze' : 'freeze'
                  Http.post(`/user/${operation}`, { ids: [record.id] })
                    .then(res => {
                      message.success(`${record.frozen ? '解冻' : '冻结'}成功`)
                      this.handleListChange()
                    })
                    .catch(err => {
                      this.handleListChange()
                    })
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
        onRow={(record, index) => {
          return {
            onClick: event => {
              event.preventDefault()
              if (event.target['tagName'] !== 'TD') {
                return
              }
              this.props.history.push(`${manageSiderPath}/view/${record.id}`)
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

  render() {
    return (
      <Content>
        <div className="list-page">
          <div className="list-page-content">
            <Tabs defaultActiveKey="account" onChange={() => {}}>
              <TabPane tab="科室" key="dept">
                <DeptList httpPath={`/dept`} modelName={'科室'} />
              </TabPane>
              <TabPane tab="账号" key="account">
                <div className="list-page-content-toolbar">
                  <div className="list-page-content-toolbar-search">
                    {this.renderKeywordSearchBar()}
                    {this.renderDeptSearchBar()}
                  </div>
                  <div className="list-page-content-toolbar-button">
                    {this.renderButtonBar()}
                  </div>
                </div>
                <div className="list-page-content-table">
                  {this.renderTable()}
                </div>
              </TabPane>
            </Tabs>
          </div>
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
