import React from 'react'
import {
  Layout,
  Breadcrumb,
  Select,
  Button,
  Table,
  Empty,
  message,
  Icon
} from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Http from '../../../../common/http/index'

const { Content } = Layout

type IProps = RouteComponentProps & {
  username: string
}

interface IState {
  loading: boolean
  data: {
    totalSize: number | undefined
    pageSize: number | undefined
    currentPage: number | undefined
    content: Array<any>
  }
}

class List extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      loading: true,
      data: {
        totalSize: undefined,
        pageSize: undefined,
        currentPage: undefined,
        content: []
      }
    }
  }

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      const res = await Http.post('/docm/list', {})
      this.setState({ loading: false, data: res.data.data })
    })
  }

  handleSearch = (value: string) => {
    console.log(value)
  }

  render() {
    const { data, loading } = this.state
    const columns = [
      {
        title: '序号',
        // dataIndex: 'index',
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
        title: '合同号',
        dataIndex: 'contractNum',
        key: 'contractNum'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: '操作',
        // dataIndex: 'operation',
        key: 'operation',
        render() {
          return (
            <div>
              <Icon
                style={{ fontSize: '17px', margin: '0 9px 0 0' }}
                title={'编辑'}
                type="edit"
                onClick={() => {
                  message.error('保存失败')
                }}
              />
              <Icon
                style={{ fontSize: '17px' }}
                title={'下载'}
                type="download"
                onClick={() => {
                  message.success('下载成功')
                }}
              />
            </div>
          )
        }
      }
    ]
    return (
      <Content
        style={{
          background: '#fff',
          margin: 0,
          minHeight: 280
        }}
      >
        <Breadcrumb style={{ margin: '8px' }}>
          <Breadcrumb.Item>当前位置：</Breadcrumb.Item>
          <Breadcrumb.Item>文档库</Breadcrumb.Item>
          <Breadcrumb.Item>文档管理</Breadcrumb.Item>
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
              mode="default"
              placeholder="请输入关键字"
              style={{ width: '250px' }}
              showArrow={false}
              onSearch={this.handleSearch}
              showSearch
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
              <Button type="ghost">批量删除</Button>
            </span>
          </div>
        </div>
        <div style={{ margin: '8px' }}>
          {loading || data.content.length > 0 ? (
            <Table
              rowKey={record => {
                return record.id
              }}
              columns={columns}
              dataSource={data.content}
              loading={loading}
              pagination={{ position: 'bottom' }}
            />
          ) : (
            <Empty description={'暂无内容'} />
          )}
        </div>
      </Content>
    )
  }
}

export default withRouter(List)
