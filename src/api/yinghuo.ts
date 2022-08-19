import { useGlobalState } from "@/models";
import axios from "axios";
import onceInit from 'once-init'
import { TaroAdapter } from "./utils/adapter";

const API_URL = 'https://store.oscac-sh.com/index.php';
export const baseAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  adapter: TaroAdapter, // add this line，添加这一行使用taroAdapter
});

const onceLogin = onceInit(() => useGlobalState.getState().actions.login());

baseAxios.interceptors.request.use(async (config) => {
  // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

  const match = skipLoginUrls.find(item => config.params.s === item);
  if (match) return config;

  const userInfo = await onceLogin.init();

  if (!config.params) config.params = {}
  config.params.token = userInfo.token

  return config;
});

baseAxios.interceptors.response.use(response => {
  return response.data;
});

// 请求列表
enum APIPath {
  用户登录 = '/api/user/login',
  获取商品列表 = '/api/goods/lists',
  获取商品详情 = '/api/goods/detail',
  立即购买 = '/api/order/buyNow',
  订单列表 = '/api/user.order/lists',
  订单付款 = '/api/user.order/pay',
  订单取消 = '/api/user.order/cancel',
  订单详情 = '/api/user.order/detail'
}

// 请求方式
enum Method {
  POST = 'POST',
  GET = 'GET',
}

// 跳过标记的请求链接
export const skipLoginUrls = [
  APIPath.用户登录,
  APIPath.获取商品列表,
  APIPath.获取商品详情
]

// // 请求封装
// const common = async ({ action, method, params }) => {

//   if (!skipTokenUrls.includes(action)) {
//     const result = await loginQueue();
//     if (!result) await promiseLogin();
//     const { global: { userBaseInfo } }: RootState = store.getState();
//     params.token = userBaseInfo.token
//   }


//   const finalParams = { s: action }
//   // 请求后缀
//   const urlSearch = qs.stringify(method === Method.GET ? { ...finalParams, ...params } : finalParams);
//   // 请求体
//   const requestParams: any = {
//     url: `${API_ROOT}?${urlSearch}`, // url
//     header: { // 请求头
//       'content-type': 'application/x-www-form-urlencoded'
//     },
//     method, // 请求方式
//   }
//   if (method === Method.POST) requestParams.data = params


//   return Taro.request(requestParams).then(response => {
//     const { data } = response;
//     if (data.code == 0) {
//       const error = new Error('服务器 0 报错');
//       error.message = data.msg;
//       error.code = data.code;
//       return Promise.reject(error);
//     }
//     return data
//   })
// }

const common = ({ action, method, params }) => {
  console.log(' action, method, params : ', action, method, params)
  return method === Method.GET ?
    baseAxios.get('', { params: { ...params, s: action } }) :
    baseAxios.post('', params, { params: { s: action } });
}

// 用户登录
export const login = params => {
  return common({ action: APIPath.用户登录, params, method: Method.POST })
}

// 获取商品列表
export const getGoodsList = (params?) => {
  return common({ action: APIPath.获取商品列表, params, method: Method.GET })
}

// 获取商品详情
export const getGoodsDetail = params => {
  return common({ action: APIPath.获取商品详情, params, method: Method.POST })
}

// 立即购买
export const buyNow = params => {
  return common({ action: APIPath.立即购买, params, method: Method.POST })
}
// 订单列表
export const getOrderList = params => {
  return common({ action: APIPath.订单列表, params, method: Method.GET })
}
// 订单支付
export const orderPay = params => {
  return common({ action: APIPath.订单付款, params, method: Method.POST })
}

// 订单取消
export const orderCancel = params => {
  return common({ action: APIPath.订单取消, params, method: Method.POST })
}

// 查询订单支付情况
export const getOrderDetail = params => {
  return common({ action: APIPath.订单详情, params, method: Method.GET })
}
