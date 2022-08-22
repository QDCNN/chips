import '@/polyfills/lodash'
import { Schema } from '@formily/react'
import { simpleCompiler } from './utils/formily'
import { useGlobalState } from './models'
import '@antmjs/vantui/lib/index.less'
import { useDictionaryState } from './models/dictionary'
import './app.less'
import { useEffect } from 'react'
import { setValidateLanguage } from '@formily/core'

Schema.registerCompiler(simpleCompiler);
setValidateLanguage('zh-CN');

const App = (props) => {
  const { actions: globalAction } = useGlobalState();
  const { actions: dictionaryAction } = useDictionaryState();

  useEffect(() => {
    dictionaryAction.init();
    globalAction.init();
  }, []);

  return (
    props.children
  )
}

export default App
