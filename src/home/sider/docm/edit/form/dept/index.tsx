import React from 'react'
import { Select } from 'antd'
import Http from '../../../../../../common/http'
import { IDeptVO } from '../../../type'

const { Option } = Select

type IProps = {
  value?: IDeptVO
  onChange?: (value) => void
}
type IState = {
  value: string
  deptData: Array<IDeptVO>
}

class DeptSelect extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value ? props.value.id : undefined,
      deptData: []
    }
  }

  componentDidMount() {
    // 加载科室下拉选择器数据
    Http.post(`/dept/list-all`)
      .then(res => {
        this.setState({ deptData: res.data.data })
      })
      .catch(err => {})
  }

  static getDerivedStateFromProps(nextProps, prevProps) {
    if (nextProps.value) {
      if (prevProps.value) {
        if (nextProps.value.id !== prevProps.value.id) {
          return { value: nextProps.value.id }
        }
      } else {
        return { value: nextProps.value.id }
      }
    }
    return null
  }

  handleOnChange(value) {
    const { onChange } = this.props
    const { deptData } = this.state
    const deptValue = deptData.find(dept => dept.id === value)
    onChange && onChange(deptValue)
    this.setState({ value })
  }

  render() {
    const { deptData, value } = this.state
    return (
      <Select
        style={{ width: '100%' }}
        placeholder={'请选择'}
        value={value}
        showSearch
        allowClear
        onChange={this.handleOnChange.bind(this)}
        filterOption={(input, option: any) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {deptData.map(dept => (
          <Option key={dept.id} value={dept.id}>
            {dept.name}
          </Option>
        ))}
      </Select>
    )
  }
}

export default DeptSelect
