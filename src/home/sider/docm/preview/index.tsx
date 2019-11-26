import React, { Component } from 'react'
import { Document, Page } from 'react-pdf'
import { serverPath } from '../../../../common/http'

type IProps = {
  docmId: string
}

interface IState {}

class PreView extends Component<IProps, IState> {
  state = {
    numPages: null,
    pageNumber: 1
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages })
  }

  render() {
    const { pageNumber, numPages } = this.state
    const { docmId } = this.props
    return (
      <div>
        <Document
          file={`${serverPath}/doc/pre-view?id=${docmId}&xAuthToken=${sessionStorage.getItem(
            'xAuthToken'
          )}`}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    )
  }
}

export default PreView
