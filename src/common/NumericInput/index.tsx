import React from 'react'
import {
  Input
  // Tooltip
} from 'antd'

// function formatNumber(value) {
//   value += "";
//   const list = value.split(".");
//   const prefix = list[0].charAt(0) === "-" ? "-" : "";
//   let num = prefix ? list[0].slice(1) : list[0];
//   let result = "";
//   while (num.length > 3) {
//     result = `,${num.slice(-3)}${result}`;
//     num = num.slice(0, num.length - 3);
//   }
//   if (num) {
//     result = num + result;
//   }
//   return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
// }

interface IProps {
  value?: string
  placeholder?: string
  tips?: string
  onBlur?: () => void
  onChange: (value: any) => void
}

interface IState {}

class NumericInput extends React.Component<IProps, IState> {
  onChange = e => {
    const { value } = e.target
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    if (
      (!Number.isNaN(value) && reg.test(value)) ||
      value === '' ||
      value === '-'
    ) {
      this.props.onChange(value)
    }
  }

  // '.' at the end or only '-' in the input box.
  onBlur = () => {
    const { value, onBlur, onChange } = this.props
    console.log(value)
    if (value && (value.charAt(value.length - 1) === '.' || value === '-')) {
      onChange({ value: value.slice(0, -1) })
    }
    if (onBlur) {
      onBlur()
    }
  }

  render() {
    // const { value, tips } = this.props;
    // const title = value ? (
    //   <span className="numeric-input-title">
    //     {value !== "-" ? formatNumber(value) : "-"}
    //   </span>
    // ) : (
    //   tips
    // );
    return (
      // <Tooltip
      //   trigger={"focus"}
      //   title={title}
      //   placement="topLeft"
      //   overlayClassName="numeric-input"
      // >
      // </Tooltip>
      <Input
        {...this.props}
        onChange={this.onChange}
        onBlur={this.onBlur}
        maxLength={25}
      />
    )
  }
}

export default NumericInput
