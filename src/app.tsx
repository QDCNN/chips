import { Component } from 'react'
import './app.less'
// 骨架屏样式
import 'taro-skeleton/dist/index.css'
import { actionCreator, store } from './store'
import { Provider } from 'react-redux'
import '@/polyfills/lodash'
// import 'taro-ui/dist/style/index.scss' // 全局引入一次即可
class App extends Component {

  componentDidMount() {
    store.dispatch(actionCreator.global.init());
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // this.props.children 是将要会渲染的页面
  render() {
    return (
      <Provider store={store} >
        {
          this.props.children
        }
      </Provider>
    )
  }
}

export default App
