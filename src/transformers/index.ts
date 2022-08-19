import { DrawerState } from "@/hooks/create-drawer";

type FormApi = ({ params, options }: { params: any, options?: any }) => any;
/**
 * 单个 form 参数类型接口处理器
 * ({ form: { page: number, pageSize: number, [key: string]: any }})
 * @param api
 */
export function formParamsPipeline<A extends FormApi>(api: A) {
  return ({ pagination, params }: { pagination: DrawerState['drawer']['pagination'], params: Parameters<A>[0] }): ReturnType<A> => {
    return api({ page: pagination.page, limit: pagination.pageSize, ...params });
  };
}


/**
 * 通用分页请求返回处理
 * @param api
 */
export function commonResponsePipeline<A extends FormApi>(api: A) {
  return async (...params: Parameters<A>): Promise<{ list: any[], total: number, origin?: any }> => {
    const response = await api.apply(null, params);
    return { list: response.data.list, total: response.data.total, origin: response.data };
  };
}


export function yinghuoResponsePipeline<A extends FormApi>(api: A) {
  return async (...params: Parameters<A>): Promise<{ list: any[], total: number }> => {
    const response = await api.apply(null, params);
    return { list: response.data.list.data, total: response.data.list.total };
  };
}
