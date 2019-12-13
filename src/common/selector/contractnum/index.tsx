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

class ContractNumSelector extends React.Component<IProps, IState> {
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
    if (!value || (value as string).trim() === '') {
      return
    }
    const param = {
      contractNum: value
    }
    this.setState({ data: [], loading: true })
    setTimeout(() => {
      Http.post(`/docm/contract-num/list`, param).then(res => {
        let data = []
        if (res.data.status === '00000000' && res.data.data.length > 0) {
          data = res.data.data.map(contractNum => ({
            text: contractNum,
            value: contractNum
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
        placeholder="中标编号"
        notFoundContent={loading ? <Spin size="small" /> : null}
        filterOption={false}
        showSearch
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        showArrow={false}
        allowClear
      >
        {data.map((d, index) => (
          <Option key={`${d.value}-${index}`} value={d.value}>
            {d.text}
          </Option>
        ))}
      </Select>
    )
  }
}

export default ContractNumSelector
