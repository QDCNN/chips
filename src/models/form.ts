import * as API from '@/api/index'
import { actionCreator } from "@/store";
import Taro from "@tarojs/taro";


const initialState = {
  // 提交的数据form表单
  formData: {},

  // 映射的form表单
  format: [
    {
      type: 'input' // 表单类型 输入
    },
    {
      type: 'picker', // 滚动选择器
      mode: '' // 滚动选择器的类型
    }
  ],

  // 页面展示的json
  formPageJson: {
    /**
     * 分组
     * 
     * title
     * subtitle
     * 说明 remark
     * 
     * 表单
     * type 表单类型
     * label 
     * key 对应值
     * value input数据
     * 
     * */

  }

  /** 
   * 数据字典表
   * 国籍
   * 城市
   * ...
   * */

  /**
   * 数据提交
   * 
   * 
   * 
  */


}

const globalModel = {
  state: () => initialState,
  reducers: () => ({
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
  }),
  effects: (dispatch, getState, delay) => ({
    async init() {
      console.log('初始化');
      dispatch(actionCreator.global.getUserInfo())
    },



    // 获取用户信息
    async getUserInfo() {
      Taro.login({
        success(result) {
          console.log('Taro.login', result);
          if (result.code) {
            API.Login({ code: result.code }).then((res) => {
              console.log('用户信息', res.data);
              dispatch(actionCreator.global.setUserInfo({ ...res.data }))
            })
          }
        },
      })
    },
  })
}


export default globalModel