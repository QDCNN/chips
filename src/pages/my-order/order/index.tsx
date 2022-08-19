import ListItem from "@/components/ListItem";
import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import styles from './index.module.less'
import iconRight from '@/assets/icon/right.svg'
import { formatMoney } from "@/utils/formatMoney";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { actionCreator, store } from "@/store";
import AtListItem from "@/components/AtListItem";
import { YinghuoApi } from "@/api";



export const useCountdown = (expiryTime, order_id) => {
  const SECONDS = 1000;
  const MINUTE = 60 * SECONDS; // 分
  const HOUR = 60 * MINUTE; // 时
  const DAY = 24 * HOUR; // 天
  const [timeText, setTimeText] = useState('')
  useEffect(() => {
    let timeOut: any = null;
    timeOut = setTimeout(() => {
      let diffTime = dayjs(expiryTime).valueOf() - dayjs().valueOf()

      let timeText = '00:00:00'

      let remain = diffTime;
      const day = parseInt(String(remain / DAY));

      remain %= DAY
      const hour = parseInt(String(remain / HOUR))

      remain %= HOUR
      const minute = parseInt(String(remain / MINUTE));

      remain %= MINUTE
      const second = parseInt(String(remain / SECONDS))
      let timeList: any[] = [];
      if (day > 0) {
        timeList.push(day)
      }
      if (hour > 0) {
        let hours = hour < 10 ? `0${hour}` : day
        timeList.push(hours)
      }
      if (hour === 0) {
        let hours = '00'
        timeList.push(hours)
      }
      if (minute > 0) {
        let minutes = minute < 10 ? `0${minute}` : minute;
        timeList.push(minutes)
      }
      if (minute === 0) {
        let minutes = '00';
        timeList.push(minutes)
      }

      if (second > 0) {
        let seconds = second < 10 ? `0${second}` : second;
        timeList.push(seconds)
      }
      if (second === 0) {
        let seconds = '00'
        timeList.push(seconds)
      }

      if (timeList.length) {
        timeText = timeList.join(':');
      }
      if (diffTime <= 0) {
        YinghuoApi.orderCancel({ order_id }).then(res => {
          store.dispatch(actionCreator.global.getOrderList())
        })
      }
      // if (timeText === '00:00:00') {
      //   yinghuoAPI.orderCancel({ order_id }).then(res => {
      //     console.log('订单倒计时取消', res);
      //     store.dispatch(actionCreator.global.getOrderList())
      //   })
      // }
      setTimeText(timeText)

      return () => clearTimeout(timeOut)
    }, 1000)

  }, [timeText])


  return timeText
}





const Order = ({ item, onPay }) => {

  return (
    <View className={classNames('fiche', styles.orderCard)}>
      <View className={styles.orderNumber}>
        <View
        // className={styles.orderNumberText}
        >
          <Text className={classNames('weui-cell__desc')} >订单编号：{item.order_no}</Text>
        </View>
      </View>
      {/* <AtListItem
        // title='订单编号'
        desc={`订单编号：${item.order_no}`}
      >
      </AtListItem> */}

      <AtListItem title='服务信息'>
        {item.goods[0]?.goods_name}
      </AtListItem>
      <AtListItem title='下单时间'>
        {item.create_time}
      </AtListItem>
      <AtListItem title='服务编号'>
        {item.task_no}
      </AtListItem>
      <AtListItem title='签约人'>
        {item.name}
      </AtListItem>
      <AtListItem title='身份证号'>
        {item.idcard}
      </AtListItem>
      <AtListItem title='手机号'>
        {item.mobile}
      </AtListItem>
      <AtListItem title='应付款'>
        {`￥${formatMoney(item.order_price, 2)}`}
      </AtListItem>
      {
        item.state_text === "已付款，待发货" && (
          <AtListItem title='实付款'>
            {`￥${formatMoney(item.pay_price, 2)}`}
          </AtListItem>
        )
      }

      {
        item.state_text === "待付款" && (
          <AtListItem title='去支付'
            isLink
            desc={`请在${useCountdown(item.expiry_time, item.order_id)}内完成付款`}
            onClick={onPay}
          >
          </AtListItem>
        )
      }
    </View>

  );
}

export default Order;
