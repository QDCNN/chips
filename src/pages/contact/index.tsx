import CustomNavigationBar from '@/custom-navigation-bar'
import { View, Image, Text, Button } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.less'

const GoodsDetail = () => {
  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back title="添加咨询老师" />

      <View className={classnames('container', styles.container)}>
      </View>
    </View>
  )
}

export default GoodsDetail;
