import { Routes } from '@/routes'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.less'
import CustomNavigationBar from '@/custom-navigation-bar'
import Card from '@/components/Card'
import { CommonImage } from '@/config'
import indexCard from '@/assets/images/index-card.png'
import { AtAvatar, AtButton } from 'taro-ui'

const Index = () => {
  const onGoodsDetailClick = () => {
    Taro.navigateTo({
      url: Routes.GoodsDetail
    })
  }

  console.log('时间戳', Date.now());




  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar notFixed title="首页" />

      <View className={classnames('container', styles.container)}>
        <Card className="m-t-32" image={indexCard} onClick={onGoodsDetailClick} />
        <View className={styles.contact}>
          <View className={styles.contact_left}>
            <View className={styles.avatar}>
              <Image className={styles.avatar_image} ></Image>
            </View>
            {/* <AtAvatar size='small' circle text='凹凸实验室'></AtAvatar> */}
            <Text className={styles.nickname} >Chon</Text>
          </View>
          <View className={styles.contact_right}>
            <Text>联系我</Text>
          </View>
        </View>
      </View>

      {/* <AtButton type='primary'>TaroUI按钮</AtButton> */}
    </View>
  )
}

export default Index;
