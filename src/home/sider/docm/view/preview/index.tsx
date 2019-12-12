import React, { Component } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
// pdfjs.GlobalWorkerOptions.workerSrc = `./static/js/pdf.worker.js`

interface IProps {
  fileData: any
}

interface IState {}

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true
}

export default class Sample extends Component<IProps, IState> {
  state = {
    numPages: null
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages })
  }

  render() {
    const { numPages } = this.state
    const { fileData } = this.props
    return (
      <div>
        <div>
          <div>
            <Document
              file={fileData}
              onLoadSuccess={this.onDocumentLoadSuccess}
              options={options}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderMode={'svg'}
                />
              ))}
            </Document>
          </div>
        </div>
      </div>
    )
  }
}
