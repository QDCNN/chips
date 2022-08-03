import * as yinghuoAPI from '@/api/yinghuo'
import * as weixinAPI from '@/api'
import Taro from "@tarojs/taro";
import { actionCreator, RootState, store } from '@/store';
import { loginQueue } from '@/queue';

// 处理登录

async function loginWrapper() {
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) return {};
  // 获取用户信息
  Taro.showLoading({ title: '加载中' });
  // 获取场景值
  const launchData = Taro.getLaunchOptionsSync()
  console.log('LaunchData', launchData);

  // 获取code
  const wxLoginResult = await Taro.login()
  // 获取用户信息
  const wxUserInfoRequest = await Taro.getUserInfo()

  const userData: any = {
    code: wxLoginResult.code,
    user_info: wxUserInfoRequest.rawData,
    encrypted_data: wxUserInfoRequest.encryptedData,
    iv: wxUserInfoRequest.iv,
    signature: wxUserInfoRequest.signature,
    referee_id: launchData.query.referee_id || '',
  }

  const request = await yinghuoAPI.login({ ...userData })
  store.dispatch(actionCreator.global.setUserToken(request.data))
  // store.dispatch(actionCreator.global.getService())
  Taro.hideLoading()
  return request.data
}

export function promiseLogin() {
  return new Promise((resolve) => {
    store.dispatch(actionCreator.global.login(resolve));
  })
}


const initialState = {
  userBaseInfo: {
    token: '',
    open_id: '',
  }, // 用户基本信息
  goodsList: [], // 商品列表
  goodsDetail: {}, // 商品详情
  service: [], // 客服信息
  orderList: [], // 订单列表

}

const globalModel = {
  state: () => initialState,
  reducers: () => ({
    setUserToken(state, data) { //
      state.userBaseInfo.token = data.token;
      state.userBaseInfo.open_id = data.open_id
    },
    setGoodsList(state, data) {
      state.goodsList = data
    },
    setGoodsDetail(state, data) {
      state.goodsDetail = data
    },
    setService(state, data) {
      state.service = data
    },
    setOrderList(state, data) {
      state.orderList = data
    }
  }),
  effects: (dispatch, getState, delay) => ({
    async init() {
      // loginWrapper()
      store.dispatch(actionCreator.global.getService())

      // dispatch(actionCreator.global.getUserInfo())
      dispatch(actionCreator.global.getGoodsList())
      dispatch(actionCreator.global.getGoodsDetail())
      dispatch(actionCreator.dictionary.init())
    },
    // 获取用户信息
    // async getUserInfo() {
    //   await loginWrapper()
    // },


    // 操作前的登录
    async login(callback) {
      const loginResult = await loginQueue(() => loginWrapper());

      callback(loginResult);
    },

    // 获取商品列表
    async getGoodsList() {
      const request = await yinghuoAPI.getGoodsList({})
      dispatch(actionCreator.global.setGoodsList(request.data.list.data))
    },

    // 获取商品详情
    async getGoodsDetail() {
      const goods_id = 10001
      const request = await yinghuoAPI.getGoodsDetail({ goods_id })
      dispatch(actionCreator.global.setGoodsDetail(request.data.detail))
    },

    // 获取客服资料
    async getService() {
      const { data: { service } } = await weixinAPI.getService({})
      dispatch(actionCreator.global.setService(service))
    },

    // 获取订单列表
    async getOrderList() {
      const res = await yinghuoAPI.getOrderList({ dataType: 'all' })
      console.log('订单列表', res.data.list.data);

      dispatch(actionCreator.global.setOrderList(res.data.list.data))
    }

  })
}


export default globalModel
