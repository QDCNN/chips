import { View, Text, Icon, Button } from '@tarojs/components'
import styles from './index.module.less'
import classnames from 'classnames'
import Taro from '@tarojs/taro'
import { Routes } from '@/routes'
import CustomNavigationBar from '@/custom-navigation-bar'

const PayResult = () => {


  const onToWork = () => Taro.switchTab({ url: Routes.Work });


  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar notFixed title="结果页" />

      <View className={classnames('container', styles.container)}>
        <View className={styles.results_box}>
          <Icon size='60' type='success' />
          <View className={styles.text_box}>
            <View className='m-t-24'><Text >支付成功</Text></View>
            <View className='m-t-24'><Text className={styles.subTitle}>以为您分配审核老师，可前往「材料详情」联系审核老师，请尽快提交您的申请资料</Text></View>
          </View>
          <Button className={classnames('m-t-48', styles.success_button)} type='primary' onClick={onToWork}>去上传材料</Button>
        </View>
      </View>
    </View>
  )
}

export default PayResult;
