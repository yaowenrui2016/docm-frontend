import React from 'react'
import {
  Layout,
  Select,
  Button,
  Table,
  Empty,
  message,
  Modal,
  Tooltip,
  Radio,
  Collapse,
  Form
} from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment'
import IOperLogVO from '../type'
// import DateRange from './daterange'
import Http, { QueryResult, QueryRequest } from '../../../../common/http'
import UserSelector from '../../../../common/selector/user'
import { modulePath } from '../index'
import { toLine } from '../../../../common/util'
import { UserContext } from '../../../index'
import './index.css'

const { Content } = Layout
const { Option } = Select
const { Panel } = Collapse

type IProps = RouteComponentProps & {}

interface IState {
  loading: boolean
  selectedRowKeys: string[] | number[]
  /**
   * 模块名称下拉选数据
   */
  modules: Array<string>
  /**
   * 查询结果
   */
  data: QueryResult<IOperLogVO>
  pageSize: number | undefined
  current: number | undefined
  /**
   * 查询条件与排序
   */
  param: {
    conditions: any
    sorters: any
  }
  /**
   * 展开筛选折叠面板key
   */
  activeKey: string | undefined
  /**
   * 创建时间范围的选项值
   */
  rangeOptionValue: string | undefined
  /**
   * 操作名称下拉选数据
   */
  operNames: Array<string>
}

class List extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      loading: true,
      selectedRowKeys: [],
      modules: [],
      data: {
        total: undefined,
        content: []
      },
      pageSize: 10,
      current: 1,
      param: {
        conditions: { ranges: {} },
        sorters: {}
      },
      activeKey: 'searchPanel',
      rangeOptionValue: 'none',
      operNames: []
    }
  }

  componentDidMount() {
    this.handleListChange()
    this.loadOperNames()
  }

  handleListChange = () => {
    this.setState({ loading: true }, () => {
      const { pageSize, current, param } = this.state
      const queryRequest: QueryRequest = {
        pageSize,
        current,
        ...param
      }
      Http.post(`/operlog/list`, queryRequest)
        .then(res => {
          this.setState({ loading: false, data: res.data.data })
        })
        .catch(error => {
          this.setState({ loading: false })
        })
    })
  }

  loadOperNames = () => {
    Http.get(`/operlog/name/list-all`)
      .then(res => {
        this.setState({ operNames: res.data.data })
      })
      .catch(err => {
        message.error('加载操作名称数据失败')
      })
  }

  handleSelectChangeForOperator = value => {
    const { conditions } = this.state.param
    conditions['operator'] = value
    this.setState({ current: 1 })
    this.handleListChange()
  }

  handleSelectChangeForOperName = value => {
    const { conditions } = this.state.param
    conditions['name'] = value
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
          `/operlog?${queryString.substring(0, queryString.length - 1)}`
        )
        message.success('删除成功')
        this.handleListChange()
      }
    })
  }

  handleCreateTimeRangeChange = e => {
    let value = e.target.value
    let createTimeRange
    if (value !== 'none') {
      let start
      switch (value) {
        case 'a':
          start = moment()
            .add('day', -3)
            .format('YYYY-MM-DD HH:mm:ss')
          break
        case 'b':
          start = moment()
            .add('day', -7)
            .format('YYYY-MM-DD HH:mm:ss')
          break
        case 'c':
          start = moment()
            .add('month', -1)
            .format('YYYY-MM-DD HH:mm:ss')
          break
        case 'd':
          start = moment()
            .add('month', -6)
            .format('YYYY-MM-DD HH:mm:ss')
          break
      }
      createTimeRange = {
        start,
        end: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    } else {
      createTimeRange = undefined
    }
    const { ranges } = this.state.param.conditions
    ranges['createTime'] = createTimeRange
    this.setState({ rangeOptionValue: value, current: 1 })
    this.handleListChange()
  }

  renderPanel() {
    const { rangeOptionValue } = this.state
    const formItemLayout = {
      labelCol: {
        span: 2,
        offset: 0
      },
      wrapperCol: {
        span: 16,
        offset: 0
      }
    }
    return (
      <div>
        <Form {...formItemLayout}>
          <Form.Item label={'操作时间'}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <Radio.Group
                  value={rangeOptionValue}
                  onChange={this.handleCreateTimeRangeChange}
                >
                  <Radio.Button
                    className="radio-option"
                    key="none"
                    value="none"
                  >
                    不限
                  </Radio.Button>
                  <Radio.Button className="radio-option" key="a" value="a">
                    近三天
                  </Radio.Button>
                  <Radio.Button className="radio-option" key="b" value="b">
                    近一周
                  </Radio.Button>
                  <Radio.Button className="radio-option" key="c" value="c">
                    近一月
                  </Radio.Button>
                  <Radio.Button className="radio-option" key="d" value="d">
                    近半年
                  </Radio.Button>
                </Radio.Group>
              </div>
              {/* <div><DateRange /></div> */}
            </div>
          </Form.Item>
          <Form.Item label="操作者">
            <UserSelector onChange={this.handleSelectChangeForOperator} />
          </Form.Item>
        </Form>
      </div>
    )
  }

  renderSearchBar() {
    const { activeKey, operNames } = this.state
    const formItemLayout = {
      labelCol: {
        span: 4,
        offset: 0
      },
      wrapperCol: {
        span: 8,
        offset: 0
      }
    }
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ flex: '1' }}>
            <Form {...formItemLayout}>
              <Form.Item label={'操作名称'}>
                <Select
                  placeholder={'请选择'}
                  style={{ width: '280px' }}
                  allowClear
                  showArrow={true}
                  onChange={this.handleSelectChangeForOperName}
                >
                  {operNames.map(operName => (
                    <Option key={operName} value={operName}>{operName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </div>
          <div style={{ flex: '1' }}>
            <div style={{ float: 'right' }}>
              <Button
                type={'link'}
                onClick={() =>
                  this.setState({
                    activeKey: activeKey ? undefined : 'searchPanel'
                  })
                }
              >
                {activeKey ? '收起筛选' : '展开筛选'}
              </Button>
            </div>
          </div>
        </div>
        <Collapse bordered={false} activeKey={activeKey}>
          <Panel
            key="searchPanel"
            style={{ border: 0 }}
            showArrow={false}
            header=""
          >
            {this.renderPanel()}
          </Panel>
        </Collapse>
      </div>
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
    const colPropsfor10 = {
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
    }
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
        ...colPropsfor10,
        title: '操作名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        ...colPropsfor10,
        title: '模块名称',
        dataIndex: 'module',
        key: 'module'
      },
      {
        ...colPropsfor10,
        title: '操作者',
        dataIndex: 'operator',
        key: 'operator'
      },
      {
        ...colPropsfor10,
        title: '操作结果',
        dataIndex: 'result',
        key: 'result',
        onHeaderCell: column => ({
          style: { textAlign: 'center', width: '5%' }
        })
      },
      {
        ...colPropsfor10,
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record, index) => {
          return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
        },
        sorter: (a, b) => {
          return a.id - b.id
        }
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
              size={'small'}
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
                {this.renderSearchBar()}
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
