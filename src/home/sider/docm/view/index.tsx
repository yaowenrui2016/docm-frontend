import React from 'react'
import {
  Layout,
  Breadcrumb,
  Select,
  Button,
  Pagination,
  Table,
  Empty
} from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'

const { Content } = Layout

type IProps = RouteComponentProps & {
  username: string
}

interface IState {
  loading: boolean
  data: {
    totalSize: number | undefined
    pageSize: number | undefined
    offset: number | undefined
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
        offset: undefined,
        content: []
      }
    }
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      this.setState({ loading: false })
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
        dataIndex: 'index',
        key: 'index'
      },
      {
        title: '合同号',
        dataIndex: 'contractNum',
        key: 'contractNum'
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date'
      },
      {
        title: '备注',
        dataIndex: 'description',
        key: 'description'
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
          <span>当前位置：</span>
          <Breadcrumb.Item>文档库</Breadcrumb.Item>
          <Breadcrumb.Item>文档查询</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ margin: '8px', display: 'flex' }}>
          <Select
            mode="default"
            placeholder="请输入关键字"
            style={{ width: '200px' }}
            showArrow={false}
            onSearch={this.handleSearch}
            showSearch
          />
        </div>
        <div style={{ margin: '8px', display: 'flex' }}>
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
        </div>
        <div style={{ margin: '8px' }}>
          {loading || data.content.length > 0 ? (
            <div>
              <Table
                dataSource={data.content}
                columns={columns}
                loading={loading}
              />
              <div style={{ display: 'flex' }}>
                <Pagination defaultCurrent={6} total={data.totalSize} />
              </div>
            </div>
          ) : (
            <Empty description={'暂无内容'} />
          )}
        </div>
      </Content>
    )
  }
}

export default withRouter(List)
