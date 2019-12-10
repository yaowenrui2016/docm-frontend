import React from 'react'
import { Button, message } from 'antd'

interface IProps {
  url: string
  icon: string
  text: string
  type: any
  onClick: (e) => void
  onLoad: (fileData) => void
}
interface IState {
  loading: boolean
  disable: boolean
}

class FileDown extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      disable: false
    }
  }

  handleClick = e => {
    this.setState({ loading: true, disable: true })
    this.props.onClick(e)
    const { url } = this.props
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response
        // const blobUrl = window.URL.createObjectURL(blob)
        // this.props.onLoad(blobUrl)
        // console.log(blobUrl)
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = e => {
          const base64Data = reader.result
          this.props.onLoad(base64Data)
        }
        this.setState({ loading: false, disable: false })
      } else {
        message.error(xhr.statusText)
      }
    }
    xhr.send()
  }

  render() {
    const { text, icon, type } = this.props
    const { loading, disable } = this.state
    return (
      <Button
        type={type}
        loading={loading}
        disabled={disable}
        icon={icon}
        onClick={this.handleClick}
      >
        {loading ? '加载中' : text}
      </Button>
    )
  }
}

export default FileDown
