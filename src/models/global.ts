import Taro from "@tarojs/taro"
import create from 'zustand'
import { CommonApi, YinghuoApi } from '@/api'
import produce from 'immer'

interface ServiceState {
  state: {
    service: any[],
    goodsList: any[],
  },
  actions: {
    fetchServiceInfo: () => Promise<void>
    fetchGoodsList: () => Promise<void>
    init: () => Promise<void>
    login: () => Promise<any>
  },
}

export const useGlobalState = create<ServiceState>((set, get) => ({
  state: {
    userInfo: {},
    service: [],
    goodsList: [],
  },
  actions: {
    async init() {
      const currentState = get();
      currentState.actions.fetchServiceInfo();
      currentState.actions.fetchGoodsList();
    },
    async fetchServiceInfo() {
      const { data } = await CommonApi.getService();
      set(produce(draft => {
        draft.state.service = data.service;
      }));
    },
    async fetchGoodsList() {
      const { data } = await YinghuoApi.getGoodsList();
      console.log('data: ', data);
      set(produce(draft => {
        draft.state.goodsList = data.list.data;
      }));
    },
    async login() {
      Taro.showLoading({ title: '加载中' });
      // 获取场景值
      const launchOptions = Taro.getLaunchOptionsSync();

      // 获取code
      const wxLoginResult = await Taro.login()
      // 获取用户信息
      const wxUserInfoRequest = await Taro.getUserInfo()

      const params: any = {
        code: wxLoginResult.code,
        user_info: wxUserInfoRequest.rawData,
        encrypted_data: wxUserInfoRequest.encryptedData,
        iv: wxUserInfoRequest.iv,
        signature: wxUserInfoRequest.signature,
        referee_id: launchOptions.query.referee_id || '',
      }
      const response = await YinghuoApi.login(params);
      Taro.hideLoading();
      set(produce(draft => {
        draft.userInfo = response.data;
      }));
      return response.data;
    }
  },
}));

