import { CommonImage } from '@/config'
import CustomNavigationBar from '@/custom-navigation-bar'
import { View, Image, Text, Button } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.less'
import Card from '@/components/Card'
import { Routes } from '@/routes'
import Taro from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'


const GoodsDetail = () => {
  const { global: { goodsDetail } } = useSelector((store: RootState) => store);




  const onOrderClick = () => {
    // console.log('goodsDetailPage', goodsDetail.content);

    // console.log('onOrderClick');
    Taro.navigateTo({ url: Routes.ConfirmOrder })
  }

  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back title="服务详情" />
      <View dangerouslySetInnerHTML={{ __html: goodsDetail.content }} className={styles.backgroundImage}></View>
      <View className={classnames('container', styles.container)}>
        {/* <Card className="m-t-32" image={CommonImage.KVImage2} /> */}

        {/* <Skeleton title row={4} /> */}

        <View className={classnames(styles.footer, 'm-t-48')}>
          {/* <Image src={require('./assets/button.png')} mode="widthFix" onClick={onPayClick} /> */}
          <View className={styles.footer_box}>
            <View className={styles.footer_left}>
              <View>
                <Text>留学生一站式落户服务</Text>
              </View>
              <View>
                <Text className={styles.font_bold}>￥4,999</Text>
              </View>
            </View>
            <View className={styles.footer_right}>
              <Button className={styles.button} type='primary' onClick={onOrderClick}>下单</Button>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default GoodsDetail;
