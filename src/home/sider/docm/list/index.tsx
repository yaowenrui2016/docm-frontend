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
  Tooltip
} from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment'
import IDocmVO from '../type'
import { IDeptVO } from '../../user/manage/type'
import Http, {
  QueryResult,
  QueryRequest,
  serverPath
} from '../../../../common/http'
import { modulePath } from '../index'
import { toLine } from '../../../../common/util'
import { UserContext } from '../../../index'
import './index.css'

const { Content } = Layout
const { Option } = Select

type IProps = RouteComponentProps & {}

interface IState {
  loading: boolean
  selectedRowKeys: string[] | number[]
  /**
   * 项目类型下拉选数据
   */
  projectTypes: Array<string>
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
  deptData: Array<IDeptVO>
}

class List extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      loading: true,
      selectedRowKeys: [],
      projectTypes: [],
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
      deptData: []
    }
  }

  componentDidMount() {
    this.loadProjectTypes()
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
      Http.post('/docm/list', queryRequest)
        .then(res => {
          this.setState({ loading: false, data: res.data.data })
        })
        .catch(error => {
          this.setState({ loading: false })
        })
    })
  }

  loadProjectTypes = () => {
    Http.get(`/docm/type/list`)
      .then(res => {
        this.setState({ projectTypes: res.data.data })
      })
      .catch(err => {
        message.error('加载项目类型数据失败')
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

  handleSelectChangeForProjectType = value => {
    const { conditions } = this.state.param
    conditions['projectType'] = value
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
          `/docm?${queryString.substring(0, queryString.length - 1)}`
        )
        message.success('删除成功')
        this.handleListChange()
      }
    })
  }

  renderKeywordSearchBar() {
    return (
      <Select
        mode={'tags'}
        placeholder={'搜索合同名称或公司名称关键字'}
        style={{ width: '280px', marginRight: '24px' }}
        tokenSeparators={[' ']}
        showArrow={true}
        suffixIcon={<Icon style={{ fontSize: '16px' }} type="search" />}
        onChange={this.handleSelectChangeForKeyword}
        notFoundContent={null}
      />
    )
  }

  renderProjectTypeSearchBar() {
    const { projectTypes } = this.state
    return (
      <span>
        <label>合同类型：</label>
        <Select
          placeholder={'请选择合同类型'}
          style={{ width: '280px', marginRight: '24px' }}
          allowClear
          showArrow={true}
          onChange={this.handleSelectChangeForProjectType}
          notFoundContent={'暂无数据'}
        >
          {projectTypes.map(pType => (
            <Option key={pType} value={pType}>
              {pType}
            </Option>
          ))}
        </Select>
      </span>
    )
  }

  renderDeptSearchBar() {
    const { deptData } = this.state
    return (
      <span>
        <label>所属科室：</label>
        <Select
          placeholder={'请选择'}
          style={{ width: '280px', marginRight: '24px' }}
          allowClear
          showArrow={true}
          onChange={this.handleSelectChangeForDept}
        >
          {deptData.map(dept => (
            <Option key={dept.id} value={dept.id}>
              {dept.name}
            </Option>
          ))}
        </Select>
      </span>
    )
  }

  renderButtonBar() {
    const { selectedRowKeys } = this.state
    return (
      <UserContext.Consumer>
        {userInfo => {
          const DOCM_ADD_OPER_permission = userInfo['permissions'].find(
            perm => perm.id === 'DOCM_ADD_OPER'
          )
          const DOCM_DELETE_OPER_permission = userInfo['permissions'].find(
            perm => perm.id === 'DOCM_DELETE_OPER'
          )
          return (
            <div style={{ margin: '4px', flex: 1 }}>
              <span style={{ float: 'right' }}>
                {DOCM_ADD_OPER_permission && (
                  <Button
                    className="ele-operation"
                    type="primary"
                    onClick={() => {
                      this.props.history.push(`${modulePath}/add`)
                    }}
                  >
                    新建
                  </Button>
                )}
                {DOCM_DELETE_OPER_permission && (
                  <Button
                    type="ghost"
                    disabled={selectedRowKeys.length < 1}
                    onClick={() => {
                      this.handleDeleteOper(selectedRowKeys)
                    }}
                  >
                    批量删除
                  </Button>
                )}
              </span>
            </div>
          )
        }}
      </UserContext.Consumer>
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
        title: '合同名称',
        dataIndex: 'projectName',
        key: 'projectName',
        sorter: (a, b) => {
          return a.id - b.id
        },
        onHeaderCell: column => ({
          style: { textAlign: 'center' }
        }),
        onCell: (record, rowIndex) => ({
          style: {
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }
        }),
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        )
      },
      {
        title: '合同类型',
        dataIndex: 'projectType',
        key: 'projectType',
        sorter: (a, b) => {
          return a.id - b.id
        },
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '10%' }
        }),
        onCell: (record, rowIndex) => ({
          style: {
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }
        }),
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        )
      },
      {
        title: '公司名称',
        dataIndex: 'company',
        key: 'company',
        sorter: (a, b) => {
          return a.id - b.id
        },
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '10%' }
        }),
        onCell: (record, rowIndex) => ({
          style: {
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }
        }),
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        )
      },
      {
        title: '合同号',
        dataIndex: 'contractNum',
        key: 'contractNum',
        sorter: (a, b) => {
          return a.id - b.id
        },
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '10%' }
        }),
        onCell: (record, rowIndex) => ({
          style: {
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }
        }),
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        )
      },
      {
        title: '科室',
        dataIndex: 'dept',
        key: 'dept',
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '6%' }
        }),
        onCell: (record, rowIndex) => ({
          style: {
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }
        }),
        render: text => (
          <Tooltip placement="topLeft" title={text ? text.name : ''}>
            {text ? text.name : ''}
          </Tooltip>
        )
      },
      {
        title: '合同签订时间',
        dataIndex: 'contractTime',
        key: 'contractTime',
        sorter: (a, b) => {
          return a.id - b.id
        },
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '10%' }
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: 'center' } })
      },
      {
        title: '凭证时间',
        dataIndex: 'credentialTime',
        key: 'credentialTime',
        sorter: (a, b) => {
          return a.id - b.id
        },
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '8%' }
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
          style: { textAlign: 'center', width: '12%' }
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: 'center' } })
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record, index) => {
          return (
            <UserContext.Consumer>
              {userInfo => {
                const DOCM_EDIT_OPER_permission = userInfo['permissions'].find(
                  perm => perm.id === 'DOCM_EDIT_OPER'
                )
                const DOCM_DELETE_OPER_permission = userInfo[
                  'permissions'
                ].find(perm => perm.id === 'DOCM_DELETE_OPER')
                const DOCM_DOWNLOAD_OPER_permission = userInfo[
                  'permissions'
                ].find(perm => perm.id === 'DOCM_DOWNLOAD_OPER')
                return (
                  <div>
                    {DOCM_EDIT_OPER_permission && (
                      <Button
                        type={'link'}
                        onClick={event => {
                          event.preventDefault()
                          this.props.history.push(
                            `${modulePath}/edit/${record.id}`
                          )
                        }}
                      >
                        编辑
                      </Button>
                    )}
                    {DOCM_DOWNLOAD_OPER_permission && (
                      <Button
                        type={'link'}
                        href={`${serverPath}/doc?id=${
                          record.id
                        }&xAuthToken=${sessionStorage.getItem('xAuthToken')}`}
                        target="_blank"
                      >
                        下载
                      </Button>
                    )}
                    {DOCM_DELETE_OPER_permission && (
                      <Button
                        type={'link'}
                        onClick={() => this.handleDeleteOper([record.id])}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                )
              }}
            </UserContext.Consumer>
          )
        },
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '16%' }
        }),
        onCell: (record, rowIndex) => ({ style: { textAlign: 'center' } })
      }
    ]
    return columns
  }

  renderTable() {
    const { loading, data, pageSize, current, selectedRowKeys } = this.state
    const { total, content } = data
    return (
      <UserContext.Consumer>
        {userInfo => {
          const DOCM_DELETE_OPER_permission = userInfo['permissions'].find(
            perm => perm.id === 'DOCM_DELETE_OPER'
          )
          const rowSelection = DOCM_DELETE_OPER_permission
            ? {
                columnWidth: '30px',
                selectedRowKeys,
                onChange: selectedRowKeys => {
                  this.setState({ selectedRowKeys })
                }
              }
            : undefined
          return loading || data.content.length > 0 ? (
            <Table
              rowKey={record => {
                return record.id
              }}
              rowSelection={rowSelection}
              columns={this.buildColumns()}
              dataSource={content}
              loading={loading}
              onRow={(record, index) => {
                return {
                  onClick: event => {
                    if (event.target['tagName'] !== 'TD') {
                      return
                    }
                    this.props.history.push(`${modulePath}/view/${record.id}`)
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
                onShowSizeChange: (current, pageSize) => {
                  this.setState({ current: 1, pageSize })
                },
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
        }}
      </UserContext.Consumer>
    )
  }

  render() {
    return (
      <Content>
        <div className="list-page">
          <div className="list-page-content">
            <div className="list-page-content-toolbar">
              <div className="list-page-content-toolbar-search">
                {this.renderKeywordSearchBar()}
                {this.renderProjectTypeSearchBar()}
                {this.renderDeptSearchBar()}
              </div>
              <div className="list-page-content-toolbar-button">
                {this.renderButtonBar()}
              </div>
            </div>
            <div className="list-page-content-table">{this.renderTable()}</div>
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
