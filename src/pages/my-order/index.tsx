import CustomNavigationBar from '@/custom-navigation-bar'
import { View, Text, } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.less'
import { useDuraArray } from '@/hooks/use-dura'
import * as yinghuoAPI from '@/api/yinghuo'
import { useEffect } from 'react'
import Order from './order'
import Taro from '@tarojs/taro'
import { Routes } from '@/routes'

const model = {
  state: () => ({
    orderList: [],
  }),
  reducers: () => ({
    setOrderList(state, data) {
      state.orderList = data
    },
  }),
  effects: ({ dispatch, actionCreator }) => ({

    async getOrderList() {
      const res = await yinghuoAPI.getOrderList({ dataType: 'all' })
      dispatch(actionCreator.setOrderList(res.data.list.data))
    }
  }),
};


const MyOrder = () => {
  const [dState, dDispatch, dActionCreator] = useDuraArray(model);

  useEffect(() => {
    dDispatch(dActionCreator.getOrderList())
  }, [])

  console.log('dState.orderList', dState.orderList);


  const onPay = (item) => {
    yinghuoAPI.orderPay({ order_id: item.order_id }).then(res => {
      console.log('订单支付', res);
      if (res.code === 1) {
        Taro.requestPayment({
          timeStamp: res.data.payment.timeStamp,
          nonceStr: res.data.payment.nonceStr,
          package: `prepay_id=${res.data.payment.prepay_id}`,
          signType: 'MD5',
          paySign: res.data.payment.paySign,
          success: (res) => {
            console.log('支付成功', res);
            Taro.reLaunch({
              url: Routes.PayResultSuccess
            })
          },
          fail: (res) => {
            Taro.reLaunch({
              url: Routes.MyOrder
            })
          },
        })
      }
    })
  }

  const onBack = () => {
    Taro.reLaunch({
      url: Routes.Work
    })
  }


  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back onBack={onBack} notFixed title="我的订单" />
      <View className={classnames('container')}>
        {dState.orderList.map(item => (
          <Order item={item} onPay={() => { onPay(item) }} />
        ))}
      </View>
    </View >
  )
}

export default MyOrder;
