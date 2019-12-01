import React, { Component } from 'react'
import { Form } from 'antd'
import { formItemLayout } from '../../util'
import PayItemFormDecorator from './decorator'
import { FormComponentProps } from 'antd/lib/form'
import { IPayItemVO } from '../../type'

type IProps = {
  wrappedComponentRef: (form) => void
  data?: IPayItemVO
}
type IState = {
  data: IPayItemVO | undefined
}

class PayItemForm extends Component<IProps, IState> {
  form: React.ReactElement<FormComponentProps> | undefined = undefined
  constructor(props) {
    super(props)
    this.state = {
      data: undefined
    }
  }

  componentDidMount() {
    // 此处 不调用 则 第一次进入编辑时 无数据
    this.setValue()
  }

  static getDerivedStateFromProps(nextProps, prevProps) {
    return { data: nextProps.data }
  }

  setValue() {
    const { data } = this.state
    if (this.form) {
      const { setFieldsValue, resetFields } = this.form.props.form
      if (data) {
        setFieldsValue({ ...data })
      } else {
        resetFields()
      }
    }
  }

  render() {
    // 此处 不调用 则 无法刷新 表单数据
    this.setValue()
    return (
      <Form {...formItemLayout}>
        <PayItemFormDecorator
          wrappedComponentRef={form => {
            this.form = form
            this.props.wrappedComponentRef(form)
          }}
        />
      </Form>
    )
  }
}

export default PayItemForm
