import React, { Component } from 'react'
import { Form, Input, DatePicker } from 'antd'
import NumericInput from '../../../../../common/NumericInput'
import { FormComponentProps } from 'antd/lib/form'
import { formItemLayout } from '../../util'

type IProps = FormComponentProps & {}
type IState = {}

class PayItemForm extends Component<IProps, IState> {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form {...formItemLayout}>
        <Form.Item key={'money'} label={'金额'}>
          {getFieldDecorator('money', {
            rules: [{ required: true, message: '金额不能为空' }]
          })(<NumericInput />)}
        </Form.Item>
        <Form.Item key={'order'} label={'序号'}>
          {getFieldDecorator('order', {
            rules: [{ required: true, message: '序号不能为空' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'credentialNum'} label={'凭证号'}>
          {getFieldDecorator('credentialNum', {
            rules: [{ max: 32, message: '凭证号过长' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item key={'credentialTime'} label={'凭证时间'}>
          {getFieldDecorator('credentialTime')(
            <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
          )}
        </Form.Item>
        <Form.Item key={'desc'} label={'备注'}>
          {getFieldDecorator('desc', {
            rules: [{ max: 500, message: '备注过长' }]
          })(<Input.TextArea />)}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(PayItemForm)
