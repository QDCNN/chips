import { DrawerApiReturn, DrawerState } from './index';

export type UseDrawerApi = (pagination: any, params: any) => Promise<any>;

type ResponseHandler<T extends Page<any>> = (response: T) => { list: T['data']['list']; total: T['data']['total'] };

// TODO: prettier
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

// 列表页结构
interface Page<T> {
    list: T[];
    total: number;
}
// Php 列表页结构
interface PhpPage<T> {
  code: number;
  data: {
    data: any[];
    total: number;
    last_page: number;
  };
  msg: string;
}

// drawer 接口处理器
export function drawerApiHandler(responseHandler: ResponseHandler<any>) {
  return function<R extends UseDrawerApi>(requestHandler: R) {
    return async (pagination: DrawerState['pagination'], params: Parameters<R>[1]) => {
      const response = await requestHandler(pagination, params);
      return responseHandler(response) as DrawerApiReturn<Unpacked<Unpacked<ReturnType<R>>>>;
    };
  };
}

/**
 * 通用 Page<any> 类型返回处理
 * @param response
 */
export function commonResponseHandler<T extends PhpPage<any>>(response: T) {
  if (!response) return { list: [], total: 0 };
  return { list: response.data.data, total: response.data.total };
}

export const commonResponseWrapper = drawerApiHandler(commonResponseHandler);

export function phpCommonResponseHandler(response: any) {
  if (!response) return { list: [], total: 0 };
  return { list: response.data.list.data, total: response.data.list.total };
}

export const phpCommonResponseWrapper = drawerApiHandler(phpCommonResponseHandler);

/**
 * 通用 Page<any> 类型返回处理
 * @param response
 */
export function loadMoreResponseHandler<T extends any[]>(response: T) {
  if (!response) return { list: [], total: 0 };
  return { list: response, total: response.length };
}

export const loadMoreResponseWrapper = drawerApiHandler(loadMoreResponseHandler);

export function allResponseHandler(key: string) {
  return function<T extends Promise<any>>(response: T) {
    return { list: response[key], total: response[key].length };
  };
}

export const callbackResponseWrapper = (callback: any) => drawerApiHandler(callbackResponse(callback));
export function callbackResponse(callback: any) {
  return function<T extends Promise<any>>(response: T) {
    const list = callback(response);
    return { list, total: list.length };
  };
}

export const allResponseWrapper = (key: string) => drawerApiHandler(allResponseHandler(key));

type FormApi = (params: any, options?: any) => any;

/**
 * 单个 form 参数类型接口处理器
 * ({ form: { page: number, pageSize: number, [key: string]: any }})
 * @param api
 */
export function formHandler<A extends FormApi>(api: A) {
  return (pagination: DrawerState['pagination'], params: Parameters<A>[0]): ReturnType<A> => {
    return api({ ...params, page: pagination.page, listRows: pagination.pageSize });
  };
}
