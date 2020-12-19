import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import App from './app'

import rootReducer from './store/reducer'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const store = createStore(rootReducer)

export default class Index extends Component {
  render() {
    return (
      <>
        <Provider store={store}>
          <App />
        </Provider>
      </>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'))