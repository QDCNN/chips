import { Routes } from '@/routes'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.less'
import CustomNavigationBar from '@/custom-navigation-bar'
import Card from '@/components/Card'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import Contact from './components/contact'



const Index = () => {
  const { global: { customer_service } } = useSelector((store: RootState) => store);


  const onGoodsDetailClick = () => {
    Taro.navigateTo({
      url: Routes.GoodsDetail
    })
  }
  // 添加微信
  const onAddContact = () => {
    Taro.navigateTo({
      url: Routes.Contact
    })
  }


  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar notFixed title="首页" />
      <View className={classnames('container', styles.container)}>
        <Card className="m-t-32" image='https://chips-tdmd.oss-cn-shanghai.aliyuncs.com/index_card.png' onClick={onGoodsDetailClick} />
      </View>
      {customer_service[0] && (
        <View className={styles.contact}>
          <Contact
            avatar={customer_service[0]?.avatar}
            username={customer_service[0]?.name}
            intr={customer_service[0]?.intr}
            onClick={onAddContact}
          />
        </View>
      )}
    </View>
  )
}

export default Index;
