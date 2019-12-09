import React, { Component } from 'react'
import { Form, Col, Row, Input, DatePicker } from 'antd'
import NumericInput from '../../../../../common/NumericInput'
import DeptSelect from './dept'
import { FormComponentProps } from 'antd/lib/form'
import { formItemLayout, colLayout } from '../../util'

type IProps = FormComponentProps & {}
type IState = {}

class EditForm extends Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      deptData: []
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    getFieldDecorator('id')
    getFieldDecorator('attachments')
    return (
      <Form {...formItemLayout}>
        <Row gutter={10}>
          <Col {...colLayout}>
            <Form.Item key={'projectName'} label="合同名称">
              {getFieldDecorator('projectName', {
                rules: [
                  { required: true, message: '请输入合同名称' },
                  {
                    max: 10,
                    message: '名称过长'
                  }
                ]
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item key={'dept'} label="所属科室">
              {getFieldDecorator('dept')(<DeptSelect />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col {...colLayout}>
            <Form.Item key={'company'} label="乙方名称">
              {getFieldDecorator('company', {
                rules: [{ required: false, message: '请输入乙方名称' }]
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item key={'projectType'} label="合同类型">
              {getFieldDecorator('projectType', {
                rules: [{ required: false, message: '请输入合同类型' }]
              })(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col {...colLayout}>
            <Form.Item key={'contractNum'} label="中标编号">
              {getFieldDecorator('contractNum', {
                rules: [{ required: false, message: '请输入合同号' }]
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item key={'contractTime'} label="合同签订时间">
              {getFieldDecorator('contractTime')(
                <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col {...colLayout}>
            <Form.Item key={'money'} label="金额">
              {getFieldDecorator('money', {
                rules: [{ required: true, message: '请填写合同金额' }]
              })(
                <NumericInput onChange={value => {}} tips={'请输入合同金额'} />
              )}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item key={'description'} label={'备注'}>
              {getFieldDecorator('description', {
                rules: [{ max: 500, message: '不能超过500字符' }]
              })(<Input.TextArea />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(EditForm)
