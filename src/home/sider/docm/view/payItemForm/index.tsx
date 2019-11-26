import React, { Component } from 'react'
import { Form } from 'antd'
import { formItemLayout } from '../../util'
import PayItemFormDecorator from './decorator'
import { FormComponentProps } from 'antd/lib/form'

type IProps = { wrappedComponentRef: (form) => void }
type IState = {}

class PayItemForm extends Component<IProps, IState> {
  form: React.ReactElement<FormComponentProps> | undefined = undefined
  render() {
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
