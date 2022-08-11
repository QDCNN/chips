import CustomNavigationBar from '@/custom-navigation-bar'
import { View, Image, Text, Button } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.less'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'


const GoodsDetail = () => {
  const { global: { service } } = useSelector((store: RootState) => store);

  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar notFixed back title="添加咨询老师" />
      <View className={classnames('container', styles.container)}>
        {/* <View className={styles.contact_img}> */}
        <Image src={service[0]?.work_card} mode="widthFix" show-menu-by-longpress='true' className={styles.contact_img}></Image>
        {/* </View> */}
      </View>
    </View>
  )
}

export default GoodsDetail;
