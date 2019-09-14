import React from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import Http from '../../http'

const { Option } = Select

interface IProps {
  onChange?: (value: string) => void
}

interface IState {
  /**
   * 查询条件与排序
   */
  param: {
    conditions: any
    sorters: any
  }
  data: Array<{ text: string; value: string }>
  value: Array<any>
  loading: boolean
}

class UserSelector extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.fetchUser = debounce(this.fetchUser, 800)
    this.state = {
      param: {
        conditions: { ranges: {} },
        sorters: {}
      },
      data: [],
      value: [],
      loading: false
    }
  }

  fetchUser = value => {
    const queryRequest = {
      pageSize: 100,
      current: 1,
      conditions: { keywordUsername: value },
      sorters: { username: 'asc' }
    }
    this.setState({ data: [], loading: true })
    setTimeout(() => {
      Http.post(`/user/search`, queryRequest).then(res => {
        let data = []
        if (
          res.data.status === '00000000' &&
          res.data.data.content.length > 0
        ) {
          data = res.data.data.content.map(account => ({
            text: account.username,
            value: account.username
          }))
        }
        this.setState({ data, loading: false })
      })
    }, 300)
  }

  handleChange = value => {
    const { onChange } = this.props
    this.setState({
      value,
      data: [],
      loading: false
    })
    onChange && onChange(value)
  }

  render() {
    const { loading, data, value } = this.state
    return (
      <Select
        value={value}
        placeholder="搜索用户"
        notFoundContent={loading ? <Spin size="small" /> : null}
        filterOption={false}
        showSearch
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        showArrow={false}
        allowClear
        style={{ width: '280px' }}
        // suffixIcon={<Icon style={{ fontSize: '16px' }} type="search" />}
      >
        {data.map(d => (
          <Option key={d.value}>{d.text}</Option>
        ))}
      </Select>
    )
  }
}

export default UserSelector
