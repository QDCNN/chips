import { Routes } from '@/routes'
import { View, } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.less'
import CustomNavigationBar from '@/custom-navigation-bar'
import Card from '@/components/Card'

const Index = () => {
  const onGoodsDetailClick = () => {
    Taro.navigateTo({
      url: Routes.GoodsDetail
    })
  }
  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar notFixed title="首页" />
      <View className={classnames('container', styles.container)}>
        <Card className="m-t-32" image='https://chips-tdmd.oss-cn-shanghai.aliyuncs.com/index_card.png' onClick={onGoodsDetailClick} />
      </View>
    </View>
  )
}

export default Index;
