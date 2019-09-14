import React from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'

interface IProps {
  startValue?: moment.Moment | undefined
  endValue?: moment.Moment | undefined
  onStartChange?: (value: string) => void
  onEndChange?: (value: string) => void
}

interface IState {
  startValue: moment.Moment | undefined
  endValue: moment.Moment | undefined
  endOpen: boolean
}
class DateRange extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      startValue: undefined,
      endValue: undefined,
      endOpen: false
    }
  }

  disabledStartDate = startValue => {
    const { endValue } = this.state
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  disabledEndDate = endValue => {
    const { startValue } = this.state
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  onStartChange = value => {
    const { onStartChange } = this.props
    this.setState({
      startValue: value
    })
    onStartChange && onStartChange(value)
  }

  onEndChange = value => {
    const { onEndChange } = this.props
    this.setState({
      endValue: value
    })
    onEndChange && onEndChange(value)
  }

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  handleEndOpenChange = open => {
    this.setState({ endOpen: open })
  }

  render() {
    const { startValue, endValue, endOpen } = this.state
    return (
      <div>
        <DatePicker
          disabledDate={this.disabledStartDate}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={startValue}
          placeholder="Start"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        {` ~ `}
        <DatePicker
          disabledDate={this.disabledEndDate}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={endValue}
          placeholder="End"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </div>
    )
  }
}

export default DateRange
