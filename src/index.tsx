import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Home from './home/index'
// import LoginForm from './login/index'

interface IProps {}

interface IState {
  userId: string | undefined
}

class App extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      userId: undefined
    }
  }

  render() {
    // const { userId } = this.state
    // return userId ? (
    //   <Home userId={userId} />
    // ) : (
    //   <LoginForm
    //     onChange={(userId: string) => {
    //       this.setState({ userId })
    //     }}
    //   />
    // )
    return <Home userId="yaowr" />
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
