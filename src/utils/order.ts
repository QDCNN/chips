import { Routes } from "@/routes";
import Taro from "@tarojs/taro";
import { combineQuery } from "./route";

export const handlePay = async (data) => {
  try {
    await Taro.requestPayment({
      timeStamp: data.payment.timeStamp,
      nonceStr: data.payment.nonceStr,
      package: `prepay_id=${data.payment.prepay_id}`,
      signType: 'MD5',
      paySign: data.payment.paySign,
    });
    Taro.redirectTo({ url: combineQuery(Routes.OrderResult, { id: data.order_id }) })
  } catch (e) {
    Taro.showToast({
      title: '支付失败',
      icon: 'error',
      duration: 3000
    })
  }
}
