import { useGlobalState } from "@/models";
import axios from "axios";
import { TaroAdapter } from "axios-taro-adapter";
import onceInit from 'once-init'
import { skipLoginUrls as commonSkipLoginUrls } from './common';
import { skipLoginUrls as yinghuoSkipLoginUrls } from './yinghuo';

// const API_URL = '';
export const baseAxios = axios.create({
  baseURL: '',
  timeout: 10000,
  adapter: TaroAdapter, // add this line，添加这一行使用taroAdapter
});

const onceLogin = onceInit(() => useGlobalState.getState().actions.login());

baseAxios.interceptors.request.use(async (config) => {
  const filtered = [...commonSkipLoginUrls, ...yinghuoSkipLoginUrls].filter(item => config.url?.includes(item));
  if (!filtered.length) await onceLogin.init();

  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  // config.headers['openid'] = 'application/x-www-form-urlencoded';

  return config;
});

baseAxios.interceptors.response.use(response => {
  // console.log('response: ', response);
  return response.data;
});
