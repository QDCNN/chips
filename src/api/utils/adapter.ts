import Taro from "@tarojs/taro";
import buildURL from 'axios/lib/helpers/buildURL'
import buildFullPath from 'axios/lib/core/buildFullPath'
import settle from 'axios/lib/core/settle'

// function settle(resolve, reject, res, failed) {
//   if (!failed) {
//     resolve(res);
//   } else {
//     reject(res);
//   }
// }

export function TaroAdapter(config) {
  return new Promise((resolve, reject) => {
    Taro.request({
      ...config,
      url: buildURL(buildFullPath(config.baseURL, config.url), config.params, config.paramsSerializer),
      data: config.data,
      method: config.method,
      header: config.headers,
      timeout: config.timeout,
      success: function (res) {
        var response = {
          ...res,
          status: res.statusCode,
          statusText: res.errMsg,
          headers: res.header,
          config: config,
          request: null
        };

        settle(resolve, reject, response);
      },
      fail: function (res) {
        var response = {
          ...res,
          status: res.statusCode,
          statusText: res.errMsg,
          headers: res.header,
          config: config,
          request: null
        };

        settle(resolve, reject, response, true);
      }
    })
  })
}
