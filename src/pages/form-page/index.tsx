import AtInput from '@/components/AtInput'
import CustomNavigationBar from '@/custom-navigation-bar'
import { View, Image, Text, Button } from '@tarojs/components'
import classnames from 'classnames'
import { useState } from 'react'
// import { AtInput } from 'taro-ui'
import styles from './index.module.less'




const FormPage = () => {
  const [text, setText] = useState('123')

  const onWrite = (e) => {
    setText(e)

  }

  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back notFixed title="formPae" />

      <View className={styles.container}>
        <AtInput title='标题' value={text} error onChange={(e) => { onWrite(e) }}></AtInput>
      </View>
    </View>
  )
}

export default FormPage;
