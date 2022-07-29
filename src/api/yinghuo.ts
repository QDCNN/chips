import { loginQueue } from '@/queue';
import { actionCreator, RootState, store } from '@/store';
import Taro from '@tarojs/taro';
import qs from 'qs'
import { promiseLogin } from '@/models/global';

//  請求前綴
const API_ROOT = 'https://store.oscac-sh.com/index.php';

// 请求列表
enum APIPath {
  用户登录 = '/api/user/login',
  获取商品列表 = '/api/goods/lists',
  获取商品详情 = '/api/goods/detail',
  立即购买 = '/api/order/buyNow',
  订单列表 = '/api/user.order/lists',
  订单付款 = '/api/user.order/pay',
}

// 请求方式
enum Method {
  POST = 'POST',
  GET = 'GET',
}

// 跳过标记的请求链接
const skipTokenUrls = [
  APIPath.用户登录,
  APIPath.获取商品列表,
  APIPath.获取商品详情
]




// 请求封装
const commomRequest = async ({ action, method, params }) => {

  if (!skipTokenUrls.includes(action)) {
    const { global: { userBaseInfo } }: RootState = store.getState();
    if (!userBaseInfo.token) {
      const result = await promiseLogin();
    }
    params.token = userBaseInfo.token
  }


  const finalParams = { s: action }
  // 请求后缀
  const urlSearch = qs.stringify(method === Method.GET ? { ...finalParams, ...params } : finalParams);
  // 请求体
  const requestParams: any = {
    url: `${API_ROOT}?${urlSearch}`, // url
    header: { // 请求头
      'content-type': 'application/x-www-form-urlencoded'
    },
    method, // 请求方式
  }
  if (method === Method.POST) requestParams.data = params
  console.log('requestParams', requestParams);


  return Taro.request(requestParams).then(response => {
    const { data } = response;
    if (data.code == 0) {
      const error = new Error('服务器 0 报错');
      error.message = data.msg;
      error.code = data.code;
      return Promise.reject(error);
    }
    return data
  })
}


// 请求方法列表

// 用户登录
export const login = params => {
  return commomRequest({ action: APIPath.用户登录, params, method: Method.POST })
}

// 获取商品列表
export const getGoodsList = params => {
  return commomRequest({ action: APIPath.获取商品列表, params, method: Method.GET })
}

// 获取商品详情
export const getGoodsDetail = params => {
  return commomRequest({ action: APIPath.获取商品详情, params, method: Method.POST })
}

// 立即购买 
export const buyNow = params => {
  return commomRequest({ action: APIPath.立即购买, params, method: Method.POST })
}
// 订单列表
export const getOrderList = params => {
  return commomRequest({ action: APIPath.订单列表, params, method: Method.GET })
}
// 订单支付
export const orderPay = params => {
  return commomRequest({ action: APIPath.订单付款, params, method: Method.POST })
}
