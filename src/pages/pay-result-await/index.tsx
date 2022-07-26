import { View, Text, Icon, Button } from '@tarojs/components'
import styles from './index.module.less'
import classnames from 'classnames'
import CustomNavigationBar from '@/custom-navigation-bar'

const PayResult = () => {

  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back notFixed title="确认订单" />
      <View className={classnames('container', styles.container)}>
        <View className={styles.results_box}>
          <Icon size='60' type='waiting' />
          <View className={styles.text_box}>
            <View className='m-t-24'><Text className={styles.title}>正在检查支付结果</Text></View>
            <View className='m-t-24'><Text className={styles.subTitle}>请稍等</Text></View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default PayResult;
