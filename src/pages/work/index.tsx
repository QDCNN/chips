import { View, Text } from '@tarojs/components'
import styles from './index.module.less'
import classnames from 'classnames'
import Taro from '@tarojs/taro'
import { Routes } from '@/routes'
import CustomNavigationBar from '@/custom-navigation-bar'
import ListItem from '@/components/ListItem'
import addressIcon from '@/assets/icon/address.svg'
import rightIcon from '@/assets/icon/right.svg'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'


const Mine = () => {
  const { global: { userInfo, goods } } = useSelector((store: RootState) => store);

  // const onOrderDetails = () => Taro.navigateTo({ url: Routes.RightsList });
  // const onMyOrder = () => Taro.navigateTo({ url: Routes.MyOrder })
  const onOrderDetails = () => {
    console.log('订单详情');
  }


  const onMyOrder = () => {
    Taro.navigateTo({
      url: Routes.MyOrder
    })
    // console.log('userInfo', userInfo);
    // console.log('goods', goods[0]);
  }
  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar notFixed title="办事" />

      <View className="container">
        <View className='fiche'>
          <ListItem
            iconLeft={addressIcon}
            title={'我的订单'}
            iconRight={rightIcon}
            onClick={onMyOrder}
          ></ListItem>
        </View>
        <View className={classnames('fiche', 'm-t-48', styles.block)}>
          <View className={styles.top}>
            <View className={styles.title}>
              <Text>留学生落户-崔正-16602116366</Text>
            </View>
            <View className={styles.content}>
              <View className={styles.item}><Text>服务编号：</Text></View>
              <View className={styles.item}><Text>咨询老师：</Text></View>
              <View className={styles.item}><Text>审核老师：</Text></View>
              <View className={styles.item}><Text>创建时间：</Text></View>
            </View>
          </View>
          <ListItem
            badge={3}
            iconRight={rightIcon}
            onClick={onMyOrder}
          ></ListItem>
        </View>
      </View>
    </View>
  )
}

export default Mine;
