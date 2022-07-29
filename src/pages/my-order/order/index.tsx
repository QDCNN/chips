import ListItem from "@/components/ListItem";
import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import styles from './index.module.less'
import iconRight from '@/assets/icon/right.svg'
import { useCountdown } from "@/utils/timeCountdown";
import { formatMoney } from "@/utils/formatMoney";


const Order = ({ item, onPay }) => {

  return (
    <View className={classNames('fiche', styles.order_card)}>
      <View className={styles.order_number}>
        <View className={styles.order_number_text}>
          <Text>订单编号：{item.order_no}</Text>
        </View>
      </View>
      <ListItem
        title='我的订单'
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
        extraText={`￥${formatMoney(item.goods[0].line_price, 2)}`}
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
