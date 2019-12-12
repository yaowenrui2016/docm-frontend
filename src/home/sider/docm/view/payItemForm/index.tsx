import React, { Component } from 'react'
import moment from 'moment'
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
    // 此处调用 为了保证 第一次进入编辑时回显数据
    this.setValue()
  }

  static getDerivedStateFromProps(nextProps, prevProps) {
    const { data } = nextProps
    return { data }
  }

  setValue() {
    const { data } = this.state
    if (this.form) {
      const { setFieldsValue, resetFields } = this.form.props.form
      if (data) {
        const {
          id,
          order,
          money,
          credentialNum,
          credentialTime,
          payTime,
          desc
        } = data
        setFieldsValue({
          id,
          order,
          money,
          credentialNum,
          credentialTime: credentialTime
            ? moment(credentialTime, 'YYYY-MM')
            : undefined,
          payTime: payTime ? moment(payTime, 'YYYY-MM-DD') : undefined,
          desc
        })
      } else {
        resetFields()
      }
    }
  }

  render() {
    return (
      <PayItemFormDecorator
        wrappedComponentRef={form => {
          this.form = form
          this.props.wrappedComponentRef(form)
        }}
      />
    )
  }
}

export default PayItemForm
