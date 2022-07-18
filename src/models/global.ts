import * as API from '@/api/index'
import { actionCreator } from "@/store";
import Taro from "@tarojs/taro";


const initialState = {
  userInfo: {},
  goods: [],
}

const globalModel = {
  state: () => initialState,
  reducers: () => ({
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setGoodsData(state, goods) {
      state.goods = goods;
    }
  }),
  effects: (dispatch, getState, delay) => ({
    async init() {
      console.log('初始化');
      dispatch(actionCreator.global.getUserInfo())
      dispatch(actionCreator.global.getGoodsDate())
    },



    // 获取用户信息
    async getUserInfo() {
      Taro.login({
        success(result) {
          if (result.code) {
            API.Login({ code: result.code }).then((res) => {
              console.log('用户信息', res.data);

              dispatch(actionCreator.global.setUserInfo({ ...res.data }))
            })
          }
        },
      })
    },

    // 获取静态资源信息
    async getGoodsDate() {
      API.getResources({}).then((res) => {
        console.log(res.data.goods[0]);
        dispatch(actionCreator.global.setGoodsData({ ...res.data.goods }))
      })

    }
  })
}


export default globalModel