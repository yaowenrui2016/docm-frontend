import React, { PureComponent } from 'react'

import './style.scss'

export interface IProps {
  /** 自定义类名 */
  className?: string
  /** 侧边栏内容 */
  aside?: React.ReactNode
  /** 侧边栏宽度 */
  asideWidth?: number
  /** 侧边栏最大步数 */
  maxAsideStep?: number
  /** 默认收缩状态 */
  defaultCollapsed?: boolean
  /** 子内容 */
  children?: React.ReactNode
}

export interface IState {
  collapsed: boolean
  step: number
}

const baseCls = 'ele-collapse-aside-layout'
const defaultAsideWidth = 192
const defaultMaxAsideStep = 2

/** 层级架构首页 */
export default class CollapseAsideLayout extends PureComponent<IProps, IState> {
  static defaultProps: IProps = {
    asideWidth: defaultAsideWidth,
    maxAsideStep: defaultMaxAsideStep
  }

  constructor(props: IProps) {
    super(props)

    const { defaultCollapsed = false } = props

    this.state = {
      collapsed: defaultCollapsed,
      step: defaultCollapsed ? 0 : 1
    }
  }

  renderAside = () => {
    const { aside, asideWidth = defaultAsideWidth } = this.props
    const { step } = this.state

    const cls = baseCls + '-aside'

    return (
      <div
        className={cls + '-wrapper'}
        style={{
          width: step * asideWidth
        }}
      >
        <div
          className={cls + '-inner'}
          style={{
            width: step > 0 ? step * asideWidth + 17 : 0
          }}
        >
          <div
            className={cls}
            style={{
              width: step * asideWidth
            }}
          >
            {aside}
          </div>
        </div>
      </div>
    )
  }

  renderContent = () => {
    const { children, asideWidth = defaultAsideWidth } = this.props
    const { step } = this.state
    const cls = baseCls + '-content'

    return (
      <div
        className={cls + '-wrapper'}
        style={{
          paddingLeft: step * asideWidth
        }}
      >
        <div className={cls + '-inner'}>
          <div className={cls}>{children}</div>
        </div>
      </div>
    )
  }

  render() {
    const {
      className,
      asideWidth = defaultAsideWidth,
      maxAsideStep = defaultMaxAsideStep
    } = this.props
    const { step } = this.state
    const clss = [baseCls]
    className && clss.push(className)
    this.state.collapsed && clss.push(`${baseCls}-collapsed`)

    return (
      <div className={clss.join(' ')}>
        <div
          className={`${baseCls}-toggle`}
          style={{
            left: step * asideWidth - 1
          }}
        >
          <div
            className={[
              `${baseCls}-toggle-arrow`,
              `${baseCls}-toggle-arrow-left`,
              step <= 0 ? `${baseCls}-toggle-arrow-disabled` : ''
            ].join(' ')}
            onClick={() => {
              if (step > 0) {
                const newStep = step - 1
                this.setState({
                  collapsed: newStep <= 0,
                  step: newStep
                })
              }
            }}
          />
          <div
            className={[
              `${baseCls}-toggle-arrow`,
              `${baseCls}-toggle-arrow-right`,
              step >= maxAsideStep ? `${baseCls}-toggle-arrow-disabled` : ''
            ].join(' ')}
            onClick={() => {
              if (step < maxAsideStep) {
                this.setState({
                  step: step + 1,
                  collapsed: false
                })
              }
            }}
          />
        </div>
        {this.renderAside()}
        {this.renderContent()}
      </div>
    )
  }
}
