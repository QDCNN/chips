import './app.less'
import { store } from './store'
import { Provider } from 'react-redux'
import '@/polyfills/lodash'
import { Schema } from '@formily/react'
import { simpleCompiler } from './utils/formily'
import { useDidShow } from '@tarojs/taro'
import { useGlobalState } from './models'
import '@antmjs/vantui/lib/index.less'

Schema.registerCompiler(simpleCompiler);

const App = (props) => {
  const { actions } = useGlobalState();

  useDidShow(() => {
    // store.dispatch(actionCreator.global.init());
    actions.init();
  });

  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  )
}

export default App
