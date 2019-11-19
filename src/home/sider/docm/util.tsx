import React from 'react'
import { Tooltip } from 'antd'

export const colLayout = {
  xs: { span: 24 },
  md: { span: 12 }
}

export const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    md: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 12 },
    md: { span: 18 }
  }
}

export const singleRowFormItemLayout = {
  labelCol: {
    xs: { span: 6 },
    md: { span: 2 }
  },
  wrapperCol: {
    xs: { span: 12 },
    md: { span: 21 }
  }
}

export const commonTableColumnProps = {
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
