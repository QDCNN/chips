import CustomNavigationBar from '@/custom-navigation-bar'
import { View, Image, Text, Button } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.less'




const FormPage = () => {



  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back notFixed title="formPae" />

      <View className={styles.container}>

      </View>
    </View>
  )
}

export default FormPage;
