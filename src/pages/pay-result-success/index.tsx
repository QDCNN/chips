import { View, Text, Icon, Button } from '@tarojs/components'
import styles from './index.module.less'
import classnames from 'classnames'
import Taro from '@tarojs/taro'
import { Routes } from '@/routes'
import { useEffect, useState } from 'react'
import CustomNavigationBar from '@/custom-navigation-bar'

const PayResult = () => {
  // const [success, setSuccess] = useState(true)
  // let timer;
  // useEffect(() => {
  //   init()
  // }, [])

  // const init = () => {
  //   Taro.showLoading({
  //     title: '加载中'
  //   })
  //   timer = setTimeout(function () {
  //     Taro.hideLoading()
  //     setSuccess(false)
  //     clearTimeout(timer)
  //   }, 2000)
  // }

  const onToWork = () => Taro.switchTab({ url: Routes.Work });


  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar notFixed title="结果页" />

      {/* {
        success ?
          <CustomNavigationBar back notFixed title="确认订单" />
          :
          <CustomNavigationBar notFixed title="确认订单" />
      } */}

      <View className={classnames('container', styles.container)}>
        <View className={styles.results_box}>
          <Icon size='60' type='success' />
          <View className={styles.text_box}>
            <View ><Text className={styles.title}>支付成功</Text></View>
            <View ><Text className={styles.subTitle}>以为您分配审核老师，可前往「办事详情」联系审核老师，请尽快提交您的申请资料</Text></View>
          </View>
          <Button className={classnames('m-t-48', styles.success_button)} type='primary' onClick={onToWork}>去办事</Button>
        </View>
        {/* {success ?
          (
            <View className={styles.results_box}>
              <Icon size='60' type='waiting' />
              <View className={styles.text_box}>
                <View ><Text className={styles.title}>正在检查支付结果</Text></View>
                <View ><Text className={styles.subTitle}>请稍等</Text></View>
              </View>
            </View>
          ) : (
            <View className={styles.results_box}>
              <Icon size='60' type='success' />
              <View className={styles.text_box}>
                <View ><Text className={styles.title}>支付成功</Text></View>
                <View ><Text className={styles.subTitle}>以为您分配审核老师，可前往「办事详情」联系审核老师，请尽快提交您的申请资料</Text></View>
              </View>
              <Button className={classnames('m-t-48', styles.success_button)} type='primary' onClick={onToWork}>去办事</Button>
            </View>
          )
        } */}
      </View>


    </View>
  )
}

export default PayResult;
