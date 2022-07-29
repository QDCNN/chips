/** 请求封装 */
import { RootState, store } from "@/store";
import Taro from "@tarojs/taro";

// 域名前缀
const API_ROOT = 'https://api.oscac-sh.com/weixin';

// 请求方式
enum Method {
  POST = 'POST',
  GET = 'GET',
}

// 请求菜单
enum APIPath {
  客服资料 = '/page/service',
  任务列表 = '/task/list',
}


// 请求方法封装

const commomRequest = async ({ action, method, params }) => {
  const { global: { userBaseInfo } }: RootState = store.getState();
  // promiseLogin()
  const openid = userBaseInfo.open_id

  const requestParams: any = openid ?
    {
      url: `${API_ROOT}${action}`,
      data: params,
      method: method,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'openid': openid
      }
    } :
    {
      url: `${API_ROOT}${action}`,
      data: params,
      method: method,
      header: {
        'content-type': 'multipart/form-data'
      }
    };

  console.log('requestParams', requestParams);


  return Taro.request(requestParams).then(response => {
    const { data } = response
    if (data.code == -1) {
      const error = new Error('服务器 0 报错');
      error.message = data.msg;
      error.code = data.code;
      return Promise.reject(error);
    }
    if (data.code == 500) {
      const error = new Error('服务器 0 报错');
      error.message = data.msg;
      error.code = data.code;
      return Promise.reject(error);
    }
    return data;
  })
}


// 获取客服资料
export function getService(params) {
  return commomRequest({ action: APIPath.客服资料, params, method: Method.GET })
}

// 获取任务列表
export function getTaskList(params) {
  return commomRequest({ action: APIPath.任务列表, params, method: Method.GET })
}
