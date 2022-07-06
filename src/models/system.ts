import { Routes, tabBarList } from '@/app.config';
import { ShareType } from '@/type';
import Taro from '@tarojs/taro';

const launchOptions = Taro.getLaunchOptionsSync()

const calcChannelId = (launchOptions) => {
  if (launchOptions.referrerInfo.appId) return launchOptions.referrerInfo.appId;
  if (launchOptions.path === Routes.CardShare) {
    if (launchOptions.query.type === ShareType.Give) return 2;
    if (launchOptions.query.type === ShareType.Demand) return 3;
  }
  if ([1011, 1124].includes(launchOptions.scene)) return 1;

  return 0;
}

const initialState = {
  currentPath: 'pages/index/index',
  channelId: calcChannelId(launchOptions),
  scene_id: launchOptions.scene || '',
};

const tabPathList = tabBarList.map(item => item.pagePath);

const systemModel = {
  state: () => initialState,
  reducers: () => ({
    setCurrentPath(state, path) {
      if (tabPathList.includes(path)) state.currentPath = path;
    },
  }),
  effects: (dispatch, getState, delay) => ({
  })
}

export default systemModel;
