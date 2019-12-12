import React, { Component } from 'react'
import { Pagination } from 'antd'
import PDF from 'react-pdf-js'

const cMapUrl = 'https://unpkg.com/pdfjs-dist@2.0.943/cmaps/'

interface IProps {
  fileData: any
}

interface IState {
  page: number
  pages: number
  fileData: any
}

export default class Sample extends Component<IProps, IState> {
  state = {
    page: 1,
    pages: 0,
    fileData: undefined
  }

  componentDidMount() {
    this.setState({ fileData: undefined })
  }

  static getDerivedStateFromProps(prevProps, nextProps) {
    return { fileData: nextProps.fileData }
  }

  onDocumentLoadSuccess = pages => {
    this.setState({ page: 1, pages })
  }

  render() {
    const { fileData } = this.props
    const { page, pages } = this.state
    console.log(fileData)
    return (
      <div>
        {fileData && (
          <div>
            <PDF
              file={fileData}
              onDocumentComplete={this.onDocumentLoadSuccess}
              page={page}
              options={{ cMapUrl, cMapPacked: true }}
            />
            <Pagination
              simple
              current={page}
              pageSize={1}
              total={pages}
              onChange={page => this.setState({ page })}
            />
          </div>
        )}
      </div>
    )
  }
}
