import * as API from '@/api'
import { actionCreator, RootState, store } from '@/store';
import Taro from '@tarojs/taro';
import { loginQueue } from '@/queue';
import { recursiveGetUserProfile } from '@/utils';
import { toutyGetUserProfile } from '@/track/utils';
import { GetUserInfoFromType, toutyHandleGetPhoneNumber, toutyHandleGetUserInfo } from '@/track/touty/utils';
import globalVariable from '@/global-variable';

export const USER_INFO_KEY = 'tdid.user';

const initialState = {
  userInfo: {
    points: 0
  },
  userBaseInfo: {
    // 默认没有
    is_mobile: 0,
    // 默认没有
    user_id: -1
  },
  termsObj: {
    card_clause: '',
    html: '',
    sign_clause: '',
    point_clause: '',
  },
  configure: {
    home_share_description: "快乐要干脆，随处是舞台！",
    home_share_image: "https://cdn-xbc-wx.lh310.com/share/home.jpg",
    home_share_title: "快乐要干脆，随处是舞台！",
    card_category: [],
    jd_url: "",
    video_url: "",
    weixin_url: "",
  },
};

async function handleUserAuthorize() {
  const userProfileResult = await recursiveGetUserProfile();
  toutyHandleGetUserInfo({ formType: GetUserInfoFromType.FisrtAuthorize, value: userProfileResult });
  const { system }: RootState = store.getState();

  const loginResult = await Taro.login();
  return await API.authorize({ channel_id: system.channelId, scene_id: system.scene_id, code: loginResult.code, user_info: userProfileResult.rawData });
}

async function loginWrapper() {
  const userInfo = globalVariable.userInfo;
  if (userInfo) return userInfo;
  Taro.showLoading({ title: '加载中' });
  const wxLoginResult = await Taro.login();
  let authorizeResult = null;
  const { data: loginResult } = await API.login({ code: wxLoginResult.code });
  Taro.hideLoading();
  if (!loginResult.user_id) {
    const { data } = await handleUserAuthorize();
    authorizeResult = data;
  }
  const data = { loginResult: authorizeResult || loginResult, isAuthorize: Boolean(authorizeResult) };
  globalVariable.userInfo = data;
  return data;
}

export function promiseLogin() {
  return new Promise((resolve) => {
    store.dispatch(actionCreator.global.login(resolve));
  })
}

const globalModel = {
  state: () => initialState,
  reducers: () => ({
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setUserBaseInfo(state, userBaseInfo) {
      const isMobile = state.userBaseInfo.is_mobile;
      state.userBaseInfo = userBaseInfo;
      if (isMobile) state.userBaseInfo.is_mobile = isMobile;
    },
    setConfigure(state, configure) {
      state.configure = configure;
    },
    setTermsObj(state, termsObj) {
      state.termsObj = termsObj;
    },
    updateMobile(state) {
      state.userBaseInfo.is_mobile = true;
    }
  }),
  effects: (dispatch, getState, delay) => ({
    async init() {
      dispatch(actionCreator.global.fetchConfigure());
      dispatch(actionCreator.global.fetchTerms());
    },
    async fetchUserInfo(isAuthorize) {
      const result = await API.getUserInfo({});
      toutyHandleGetUserInfo({ formType: GetUserInfoFromType.GetFromAPI, value: result.data });

      console.log('Taro.getApp(): ', Taro.getApp());
      if (result.data.userInfo.mobile) {
        Taro.getApp().mtj.setUserInfo({
          tel: result.data.userInfo.mobile,
        });
      }
      if (result.data.userInfo.open_id && result.data.userInfo.union_id) {
        toutyHandleGetPhoneNumber({ formType: GetUserInfoFromType.GetFromAPI, value: result.data });
      }
      // // 初次授权触发touty埋点
      // if (isAuthorize) {
      //   toutyGetUserProfile(result.data);
      // }
      dispatch(actionCreator.global.setUserInfo(result.data.userInfo));
    },
    async login(callback) {
      const { loginResult, isAuthorize } = await loginQueue(() => loginWrapper());
      dispatch(actionCreator.global.setUserBaseInfo({ ...loginResult }));
      dispatch(actionCreator.global.fetchUserInfo(isAuthorize));
      callback(loginResult);
    },
    async bindPhone({ iv, encrypted_data, callback }) {
      const result = await API.bindPhone({ iv, encrypted_data });
      dispatch(actionCreator.global.updateMobile());
      callback(result);
    },
    async fetchConfigure() {
      const result = await API.getConfigure({});
      dispatch(actionCreator.global.setConfigure({ ...result.data }));
    },
    async fetchTerms() {
      const result = await API.getPrivacyTerms({});
      dispatch(actionCreator.global.setTermsObj({ ...result.data }));
    },
    async eventTrack(params) {
      API.eventTrack(params);
    }
  })
}

export default globalModel;
