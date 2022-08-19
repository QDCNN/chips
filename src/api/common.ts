import { baseAxios } from "./base";

const ROOT_PATH = 'https://api.oscac-sh.com';

// 请求方式
enum Method {
  POST = 'POST',
  GET = 'GET',
}

// 请求菜单
enum APIPath {
  // 登录 = '/weixin/passport/login',
  // 获取首页资源 = '/weixin/page/index',
  // 立即下单 = '/weixin/order/buynow',
  // 订单列表 = '/weixin/order/list',
  // 订单支付 = '/weixin/order/payment',
  客服资料 = '/weixin/page/service',
  任务列表 = '/weixin/task/list',
  获取页面结构 = '/weixin/page/tmp',
  阿里OSSInfo = '/weixin/aliyun/ststoken',


  字典落户方式 = '/es/settlement_method/get',
  字典省市 = '/es/area_city/get',
  字典省市区 = '/es/region/get',
  字典申请人基本方式 = '/es/basic/get',
  字典家庭成员及主要社会关系 = '/es/family/get',
  字典户口迁入信息 = '/es/hukou_movein/get',
  字典档案信息 = '/es/archive/get',
  字典教育经历 = '/es/education/get',
  字典子女信息 = '/es/children/get',

  获取最近一次表单内容 = '/weixin/task/cloudget',
  提交表单内容json = '/weixin/task/cloudsave',
  用户最终提交表单 = '/weixin/task/submit',
  获取任务订单信息 = '/weixin/task/detail',
  获取阿里云图片链接 = '/weixin/aliyun/stsgetimg',
}

export const skipLoginUrls = [
  APIPath.获取页面结构,
  APIPath.字典落户方式,
  APIPath.字典省市,
  APIPath.字典申请人基本方式,
  APIPath.字典家庭成员及主要社会关系,
  APIPath.字典户口迁入信息,
  APIPath.字典档案信息,
  APIPath.字典教育经历,
  APIPath.字典子女信息,
];


// // 请求方法封装

// const common = async ({ action, method, params }) => {
//   let openid;
//   if (!skipOpenIdUrls.includes(action)) {
//     const result = await loginQueue();
//     if (!result) await promiseLogin();
//     const { global: { userBaseInfo } }: RootState = store.getState();

//     openid = userBaseInfo.open_id
//   }

//   const requestParams: any = openid ?
//     {
//       url: `${API_ROOT}${action}`,
//       data: params,
//       method: method,
//       header: {
//         'content-type': 'application/x-www-form-urlencoded',
//         'openid': openid
//       }
//     } :
//     {
//       url: `${API_ROOT}${action}`,
//       data: params,
//       method: method,
//       header: {
//         'content-type': 'multipart/form-data'
//       }
//     };

//   return Taro.request(requestParams).then(response => {
//     const { data } = response
//     if (data.code == -1) {
//       const error = new Error('服务器 0 报错');
//       error.message = data.msg;
//       error.code = data.code;
//       return Promise.reject(error);
//     }
//     if (data.code == 500) {
//       const error = new Error('服务器 0 报错');
//       error.message = data.msg;
//       error.code = data.code;
//       return Promise.reject(error);
//     }
//     return data;
//   })
// }

const common = ({ action, method, params }) => method === Method.GET ?
  baseAxios.get(ROOT_PATH + '/' + action, { params }) :
  baseAxios.post(ROOT_PATH + '/' + action, params);


// 获取客服资料
export function getService(params?) {
  return common({ action: APIPath.客服资料, params, method: Method.GET })
}

// 获取任务列表
export function getTaskList(params) {
  return common({ action: APIPath.任务列表, params, method: Method.GET })
}

// 获取页面结构
export const getPageStructure = params => {
  return common({ action: APIPath.获取页面结构, params, method: Method.GET })
}


// 获取阿里云OSS信息
export const getAliOSSInfo = params => {
  return common({ action: APIPath.阿里OSSInfo, params, method: Method.GET })
}


export const getESRegion = (params?) => {
  return common({ action: APIPath.字典省市区, params, method: Method.GET })
}

export const getESAreaCity = (params?) => {
  return common({ action: APIPath.字典省市, params, method: Method.GET })
}

export const getESSettlementMethod = (params?) => {
  return common({ action: APIPath.字典落户方式, params, method: Method.GET })
}

export const getESBasic = (params?) => {
  return common({ action: APIPath.字典申请人基本方式, params, method: Method.GET })
}

export const getESFamily = (params?) => {
  return common({ action: APIPath.字典家庭成员及主要社会关系, params, method: Method.GET })
}

export const getESHukouMovein = (params?) => {
  return common({ action: APIPath.字典户口迁入信息, params, method: Method.GET })
}

export const getESArchive = (params?) => {
  return common({ action: APIPath.字典档案信息, params, method: Method.GET })
}

export const getESEducation = (params?) => {
  return common({ action: APIPath.字典教育经历, params, method: Method.GET })
}

export const getESChildren = (params?) => {
  return common({ action: APIPath.字典子女信息, params, method: Method.GET })
}

export const 获取最近一次表单内容 = (params?) => {
  return common({ action: APIPath.获取最近一次表单内容, params, method: Method.GET })
}

export const 提交表单内容json = (params?) => {
  return common({ action: APIPath.提交表单内容json, params, method: Method.POST })
}

export const 用户最终提交表单 = (params?) => {
  return common({ action: APIPath.用户最终提交表单, params, method: Method.POST })
}

export const 获取任务订单信息 = (params?) => {
  return common({ action: APIPath.获取任务订单信息, params, method: Method.GET })
}

export const 获取阿里云图片链接 = (params?) => {
  return common({ action: APIPath.获取阿里云图片链接, params, method: Method.POST })
}



// // 获取首页资源
// export function getResources(params) {
//   return common({ action: APIPath.获取首页资源, params, method: Method.GET });
// }

// // 立即下单
// export function buyNow(params) {
//   return common({ action: APIPath.立即下单, params, method: Method.POST })
// }

// // 订单列表
// export function orderList(params) {
//   return common({ action: APIPath.订单列表, params, method: Method.GET })
// }

// // 订单支付
// export function orderPayment(params) {
//   return common({ action: APIPath.订单支付, params, method: Method.POST })
// }
