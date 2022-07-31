import ListItem from "@/components/ListItem";
import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import styles from './index.module.less'
import iconRight from '@/assets/icon/right.svg'
// import { useCountdown } from "@/utils/timeCountdown";
import { formatMoney } from "@/utils/formatMoney";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { actionCreator, store } from "@/store";
import Taro from "@tarojs/taro";
import { Routes } from "@/routes";


export const useCountdown = (expiryTime) => {
  const SECONDS = 1000;
  const MINUTE = 60 * SECONDS; // 分
  const HOUR = 60 * MINUTE; // 时
  const DAY = 24 * HOUR; // 天
  const [timeText, setTimeText] = useState('')
  useEffect(() => {
    let timeOut: any = null;
    timeOut = setTimeout(() => {
      // let now_time = dayjs().valueOf() // 当前时间戳

      // let expiry_time = dayjs('2022-07-27 15:00:00').valueOf() // 截止日期时间戳

      // let remaining_time = now_time - expiry_time  // 剩余时间时间戳

      // let timeTexts = dayjs(remaining_time).format('hh:mm:ss') // 时间戳转 mm:ss

      // setTimeText(timeTexts)

      // let nowTime = dayjs().valueOf(); // 当前时间戳(秒)
      // let endTime = dayjs(expiryTime).valueOf(); // 截止时间戳(秒)

      // let diffTime = dayjs('2022-07-27 14:00:06').diff(dayjs(), 'ms')

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
      console.log('timeText', timeText);

      if (timeText === '00:00:00') {
        Taro.reLaunch({
          url: Routes.MyOrder
        })
        // console.log('再次请求列表');
        // store.dispatch(actionCreator.global.getOrderList())
      }
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
        <View className={styles.orderNumberText}>
          <Text>订单编号：{item.order_no}</Text>
        </View>
      </View>
      <ListItem
        title='服务信息'
        extraText={item.goods[0]?.goods_name}
        border
      ></ListItem>
      <ListItem
        title='下单时间'
        extraText={item.create_time}
        border
      ></ListItem>
      <ListItem
        title='服务编号'
        extraText={item.task_no}
        border
      ></ListItem>
      <ListItem
        title='签约人'
        extraText={item.name}
        border
      ></ListItem>
      <ListItem
        title='身份证号'
        extraText={item.idcard}
        border
      ></ListItem>
      <ListItem
        title='手机号'
        extraText={item.mobile}
        border
      ></ListItem>
      <ListItem
        title='应付款'
        extraText={`￥${formatMoney(item.order_price, 2)}`}
        border
      ></ListItem>
      {
        item.state_text === "已付款，待发货" && (
          <ListItem
            title='实付款'
            extraText={`￥${item.pay_price}`}
            border
          ></ListItem>
        )
      }

      {
        item.state_text === "待付款" && (
          <ListItem
            title='去支付'
            iconRight={iconRight}
            // time={showRemainTime(item.expiry_time)}
            time={useCountdown(item.expiry_time)}
            onClick={onPay}
          ></ListItem>
        )
      }
    </View>

  );
}

export default Order;
