import CustomNavigationBar from '@/custom-navigation-bar'
import { View, Image, Text, Button } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.less'
import ZtInput from '@/components/Form/ZtInput'
import { useRouter } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'




const FormPage = () => {

  const { params } = useRouter()


  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back notFixed title="formPae" />
      {/* <CustomNavigationBar /> */}

      <View className={styles.container}>
        <AtIcon value='loading'></AtIcon>
        <ZtInput />

      </View>
    </View>
  )
}

export default FormPage;
