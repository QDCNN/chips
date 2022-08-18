import { View, Text, Icon, Button } from '@tarojs/components'
import styles from './index.module.less'
import classnames from 'classnames'
import { useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import * as yinghuoAPI from '@/api/yinghuo'
import { Routes } from '@/routes'

const PayResult = () => {
  const { params } = useRouter();


  Taro.showToast({ title: '加载中', icon: 'loading', duration: 2500 })
  useEffect(() => {
    let timeOut: any = null;
    timeOut = setInterval(() => {
      // console.log('123');

      getOrderDetail();
    }, 2000)
    return () => clearInterval(timeOut)
    // getOrderDetail()
  }, [])

  // 查询订单支付情况
  const getOrderDetail = () => {
    Taro.hideToast()
    yinghuoAPI.getOrderDetail({ order_id: params.order_id })
      .then(res => {
        if (res.code === 1) {
          if (res.data.order.pay_status.value === 10) {// 未付款
            Taro.reLaunch({
              url: Routes.MyOrder,
              success: () => {
                Taro.showToast({
                  title: '支付失败',
                  icon: 'error',
                  duration: 3000
                })
              }
            })
          } else if (res.data.order.pay_status.value === 20) { // 已付款
            Taro.reLaunch({
              url: Routes.PayResultSuccess
            })
          }
        } else {
          Taro.reLaunch({
            url: Routes.MyOrder,
            success: () => {
              Taro.showToast({
                title: '支付失败',
                icon: 'error',
                duration: 3000
              })
            }
          })
        }
      })
  }


  return (
    <View className={classnames('page', styles.page)}>
      <View className={classnames('container', styles.container)}>
        <View className={styles.resultsBox}>
          <Icon size='60' type='waiting' />
          <View className={styles.textBox}>
            <View className='m-t-24'><Text className={styles.title}>正在检查支付结果</Text></View>
            <View className='m-t-24'><Text className={styles.subTitle}>请稍等</Text></View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default PayResult;
