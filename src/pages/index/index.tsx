import { Routes } from '@/routes'
import { Button, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.less'
import CustomNavigationBar from '@/custom-navigation-bar'
import Card from '@/components/Card'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import Contact from './components/contact'


const Index = () => {
  const { global: { goodsList, service } } = useSelector((store: RootState) => store);

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
        <Card className="m-t-32" image={goodsList[0]?.goods_image} onClick={onGoodsDetailClick} />
        <Button type="primary" onClick={() => Taro.navigateTo({ url: Routes.FormPage })}>进入表单页</Button>
      </View>

      {service[0] && (
        <View className={styles.contact}>
          <Contact
            avatar={service[0]?.avatar}
            username={service[0]?.name}
            intr={service[0]?.intro}
            onClick={onAddContact}
          />
        </View>
      )}

    </View>
  )
}

export default Index;
