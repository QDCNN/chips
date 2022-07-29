import * as yinghuoAPI from '@/api/yinghuo'
import * as weixinAPI from '@/api/weixin'
import Taro from "@tarojs/taro";
import { actionCreator, RootState, store } from '@/store';

// 处理登录

async function loginWrapper() {
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) return {};
  // 获取用户信息
  Taro.showLoading({ title: '加载中' });
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
  }

  const request = await yinghuoAPI.login({ ...userData })
  store.dispatch(actionCreator.global.setUserToken(request.data))
  store.dispatch(actionCreator.global.getService())
  Taro.hideLoading()
  return request.data
}

export function promiseLogin() {
  return new Promise(() => {
    store.dispatch(actionCreator.global.getUserInfo());
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
  // taskList: {
  //   list: [],
  //   task_status: [],
  // }

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
    // setTaskList(state, data) {
    //   state.taskList.list = data.list;
    //   state.taskList.task_status = data.task_status
    // }
  }),
  effects: (dispatch, getState, delay) => ({
    async init() {
      dispatch(actionCreator.global.getUserInfo())
      dispatch(actionCreator.global.getGoodsList())
      dispatch(actionCreator.global.getGoodsDetail())
      // dispatch(actionCreator.global.getService())
      dispatch(actionCreator.dictionary.init())
    },
    // 获取用户信息
    async getUserInfo() {
      await loginWrapper()
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

    // 获取任务列表
    // async getTaskList() {
    //   const { data } = await weixinAPI.getTaskList({ page: '', limit: '' })
    //   dispatch(actionCreator.global.setTaskList(data))
    // }

    // // 获取订单列表
    // async getOrderList() {
    //   // yinghuoAPI.orderList({}).then(res => {
    //   //   console.log('orderList', res.data);
    //   // })
    // },

  })
}


export default globalModel
