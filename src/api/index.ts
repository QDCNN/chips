/** 请求封装 */

import { RootState, store } from "@/store";
import Taro from "@tarojs/taro";
import qs from 'qs';

// 域名前缀
const API_ROOT = 'https://api.oscac-sh.com/weixin';

// 请求方式
enum Method {
  POST = 'POST',
  GET = 'GET',
}

// 请求菜单
enum APIPath {
  登录 = '/passport/login',
  获取首页资源 = '/page/index',
  立即下单 = '/order/buynow',
  订单列表 = '/order/list',
  订单支付 = '/order/payment'
}


// 请求方法封装

const commomRequest = async ({ action, method, params }) => {
  console.log('method', method);
  const { global: { userInfo } }: RootState = store.getState();

  const openid = userInfo.openid
  // const finalParams = { openid };
  // const urlSearch = qs.stringify(openid ? { ...finalParams } : '');
  // console.log('userInfo', urlSearch);


  const requestParams: any = openid ?
    {
      url: `${API_ROOT}${action}`,
      data: params,
      method: method,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'openid': openid
      }
    } :
    {
      url: `${API_ROOT}${action}`,
      data: params,
      method: method,
      header: {
        'content-type': 'multipart/form-data'
      }
    };

  console.log('requestParams', requestParams);


  return Taro.request(requestParams).then(response => {
    const { data } = response
    if (data.code == -1) {
      const error = new Error('服务器 0 报错');
      error.message = data.msg;
      error.code = data.code;
      return Promise.reject(error);
    }
    if (data.code == 500) {
      const error = new Error('服务器 0 报错');
      error.message = data.msg;
      error.code = data.code;
      return Promise.reject(error);
    }

    return data;
  })
}



// 登录
export function Login(params) {
  return commomRequest({ action: APIPath.登录, method: Method.GET, params })
}

// 获取首页资源
export function getResources(params) {
  return commomRequest({ action: APIPath.获取首页资源, params, method: Method.GET });
}

// 立即下单
export function buyNow(params) {
  return commomRequest({ action: APIPath.立即下单, params, method: Method.POST })
}

// 订单列表
export function orderList(params) {
  return commomRequest({ action: APIPath.订单列表, params, method: Method.GET })
}

// 订单支付
export function orderPayment(params) {
  return commomRequest({ action: APIPath.订单支付, params, method: Method.POST })
}