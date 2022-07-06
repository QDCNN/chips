import Taro from '@tarojs/taro';
import qs from 'qs';

const skipTokenUrls = [];
const API_ROOT = 'https://xsad.tech-done.com/index.php';

enum Method {
  POST = 'POST',
  GET = 'GET',
}

enum APIPath {
  京东发送短信 = '/api/sms/jdsend',
  淘宝发送短信 = '/api/sms/tbsend',
}

const commomRequest = async ({ action, method, params }) => {
  // if (!skipTokenUrls.includes(action)) {
  //   const result = await loginQueue();
  //   if (!result) await promiseLogin();
  //   const { global: { userBaseInfo } }: RootState = store.getState();
  //   params.token = userBaseInfo.token;
  // }

  const finalParams = { s: action };
  const urlSearch = qs.stringify(method === Method.GET ? { ...finalParams, ...params } : finalParams);
  const requestParams: any = {
    url: `${API_ROOT}?${urlSearch}`,
    method,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
  };
  if (method === Method.POST) requestParams.data = params;
  return Taro.request(requestParams).then(response => {
    const { data } = response;

    if (data.code == -1) {
      // globalVariable.userInfo = null;
      // promiseLogin();
      // store.dispatch(actionCreator.global.login());
      const error = new Error('服务器 0 报错');
      error.message = data.msg;
      error.code = data.code;
      return Promise.reject(error);
    }
    if (data.code == 0) {
      const error = new Error('服务器 0 报错');
      error.message = data.msg;
      error.code = data.code;
      return Promise.reject(error);
    }
    if (data.code != 1) {
      const error = new Error('服务器报错');
      error.message = data.msg;
      error.code = data.code;
      return Promise.reject(error);
    }
    return data;
  })
}

// 京东发送短信
export function jdSendSms(params) {
  return commomRequest({ action: APIPath.京东发送短信, params, method: Method.POST });
}

// 淘宝发送短信
export function tbSendSms(params) {
  return commomRequest({ action: APIPath.淘宝发送短信, params, method: Method.POST });
}
