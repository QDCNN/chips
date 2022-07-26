import * as API from '@/api/index'
import Taro from "@tarojs/taro";
import { actionCreator, RootState, store } from '@/store';
import { loginQueue } from '@/queue';
import globalVariable from '@/global-variable';



const initialState = {
  userBaseInfo: {},

  userInfo: {},
  asserts: {},
  goods: [],
  customer_service: [],
  orderList: [],
  loginDate: {},
}



const globalModel = {
  state: () => initialState,
  reducers: () => ({
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setGoodsData(state, goods) {
      state.goods = goods;
    },
    setCustomerService(state, customer_service) {
      state.customer_service = customer_service
    },
    setAsserts(state, asserts) {
      state.asserts = asserts
    },
    setOrderList(state, orderList) {
      state.orderList = orderList
    },
    setLoginDate(state, date) {
      state.loginDate = date
    }

  }),
  effects: (dispatch, getState, delay) => ({
    async init() {
      console.log('初始化');
      dispatch(actionCreator.global.getAsserts())
      dispatch(actionCreator.global.getUserInfo())
    },
    // async login(callback) {
    //   const { loginResult, isAuthorize } = await loginQueue(() => loginWrapper());
    //   // dispatch(actionCreator.global.setUserBaseInfo({ ...loginResult }));
    //   // dispatch(actionCreator.global.fetchUserInfo(isAuthorize));
    //   callback(loginResult);
    // },


    // 获取用户信息
    async getUserInfo() {

      // Taro.login({
      //   success(result) {
      //     console.log('Taro.login', result);
      //     if (result.code) {
      //       API.Login({ code: result.code }).then((res) => {
      //         console.log('用户信息', res.data);
      //         dispatch(actionCreator.global.setUserInfo({ ...res.data }))
      //       })
      //     }
      //   },
      // })
    },

    // 获取静态资源信息
    async getAsserts() {
      // API.getResources({}).then((res) => {
      //   console.log('静态资源', res.data);
      //   dispatch(actionCreator.global.setGoodsData({ ...res.data.goods }))
      //   dispatch(actionCreator.global.setAsserts({ ...res.data }))
      //   dispatch(actionCreator.global.setCustomerService({ ...res.data.customer_service }))
      // })
    },

    // 获取订单列表
    async getOrderList() {
      // API.orderList({}).then(res => {
      //   console.log('orderList', res.data);
      // })
    },

  })
}


export default globalModel