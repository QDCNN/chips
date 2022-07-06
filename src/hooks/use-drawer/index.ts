import { isNumber, noop } from 'lodash';
import { useCallback, useMemo } from 'react';

import { createImmerPlugin } from '@/use-dura/immer';
import useDuraOrigin from '@/use-dura/taro/plus';
import { Model } from '@/use-dura/types';
import { handleError } from '@/store';

/**
 * drawer 维护数据类型
 */
export type DrawerState = {
  list: any[];
  loading: boolean;
  total: number;
  params: any;
  pagination: {
    page: number;
    pageSize: number;
  };
  isNoMore: boolean;
};

/**
 * 初始化数据
 */
const initialState: DrawerState = {
  list: [],
  loading: false,
  total: 0,
  params: {},
  pagination: {
    page: 0,
    pageSize: 10,
  },
  isNoMore: false,
};

/**
 * 传入 API 的返回类型
 */
export type DrawerApiReturn<T = any> = { list: T[]; total: number };

/**
 * 传入 API 的类型
 */
export type UseDrawerApi = (
  pagination: DrawerState['pagination'],
  params: DrawerState['params'],
) => Promise<DrawerApiReturn>;

/**
 * 工具对象
 */
type Toolkit<T extends UseDrawerApi, I extends any = any> = {
  /**
   * 按查询条件搜索
   */
  search: (params?: Parameters<T>[1]) => Promise<void>;
  /**
   * 改变每页数据大小
   */
  changePageSize: (pageSize: number) => void;
  /**
   * 清空查询条件
   */
  clearParams: () => void;
  /**
   * 读取下一页 一般在手机端使用
   */
  loadMore: () => Promise<void>;
  /**
   * 清空数据列表
   */
  clearList: () => void;
  /**
   * 不改变查询条件 直接刷新
   */
  refresh: () => void;
  /**
   * 设置数据列表
   */
  setList: (list: I[]) => void;
  /**
   * 页码跳转
   */
  jumpPage: (page: number) => Promise<void>;
};

/**
 *
 * @param value useDrawer 返回的数据
 * @param helper useDrawer 返回的工具
 */
export function usePagination<D extends DrawerState, T extends Toolkit<any>>(value: D, helper: T, options?: any) {
  const getPagination = (value: D, helper: T, options: any) => ({
    showQuickJumper: true,
    showSizeChanger: true,
    onChange: current => {
      // console.log('current: ', current, pageSize);
      // if (value.pagination.pageSize !== pageSize) {
      //   helper.changePageSize(pageSize);
      //   // helper.jumpPage(1);
      //   return;
      // }
      helper.jumpPage(current);
    },
    onShowSizeChange: (page: number, pageSize: number) => helper.changePageSize(pageSize),
    total: value.total,
    pageSize: value.pagination.pageSize,
    current: value.pagination.page,
    ...options,
  });
  return useMemo(() => getPagination(value, helper, options), [value, helper, options]);
}

const model = {
  state: () => initialState,
  reducers: () => ({
    /**
     * 初始化加载中状态
     */
    startLoading: (state: DrawerState) => {
      state.loading = true;
    },
    /**
     * 结束加载中状态
     */
    endLoading: (state: DrawerState) => {
      state.loading = false;
    },
    /**
     * 设置列表及总数
     */
    setData: (state: DrawerState, payload: { list: any[]; total: number }) => {
      state.list = payload.list;
      state.total = payload.total;
    },
    /**
     * 设置查询条件
     */
    setParams: (state: DrawerState, payload: any) => {
      state.params = payload;
    },
    /**
     * 设置页码对象
     */
    setPagination: (state: DrawerState, payload: any) => {
      state.pagination = payload;
    },
    /**
     * 设置当前页码
     */
    setPage: (state: DrawerState, page: number) => {
      state.pagination.page = page;
    },
    /**
     * 设置每页条数
     */
    setPageSize: (state: DrawerState, pageSize: number) => {
      state.pagination.pageSize = pageSize;
    },
    /**
     * 清除查询条件
     */
    clearParams: (state: DrawerState) => {
      state.params = {};
    },
    /**
     * 清空列表
     */
    clearList: (state: DrawerState) => {
      state.list = [];
    },
    /**
     * 设置列表数据
     */
    setList: (state: DrawerState, list: any[]) => {
      state.list = list;
    },
    setIsNoMore(state: DrawerState, isNoMore: boolean) {
      state.isNoMore = isNoMore;
    }
  }),
  effects: ({ dispatch, actionCreator, getState }) => ({
    async search({ pagination, params, api, isAppend }) {
      dispatch(actionCreator.startLoading());
      if (!isAppend) {
        dispatch(actionCreator.setData({ list: [], total: 0 }));
      }

      const { list, total } = await api(pagination, params);
      let finalList = list;
      if (isAppend) {
        const { list: existList } = getState();
        finalList = [...existList, ...list];
      }
      dispatch(actionCreator.setIsNoMore(pagination.page * pagination.pageSize > total));
      dispatch(actionCreator.endLoading());
      dispatch(actionCreator.setData({ list: finalList, total }));
    },
    async searchByParamsAndPage({ params, pagination: searchPagination, api, isAppend = false }) {
      const { pagination: originPagination } = getState();
      const pagination = { ...originPagination, ...searchPagination };
      dispatch(actionCreator.setPagination(pagination));
      await dispatch(actionCreator.search({ pagination, params, api, isAppend }));
      dispatch(actionCreator.setParams(params));
    }
  }),
};

function useDura<M extends Model>(model: M, onError?: any) {
  return useDuraOrigin(model, { plugins: [createImmerPlugin()], onError: handleError || noop });
}

function useDrawer<T extends UseDrawerApi>(api: T): [DrawerState, Toolkit<T>, any?] {
  const { state, dispatch, actionCreator } = useDura(model);
  const { params, pagination, isNoMore } = state;

  const commonSearch = useCallback(({ searchParams, page, pageSize, isAppend } = {}) => {
    if (!isAppend) {
      dispatch(actionCreator.setIsNoMore(false));
    } else {
      if (isNoMore) return;
    }

    const finalPagination: any = {};
    if (isNumber(page)) finalPagination.page = page;
    if (isNumber(pageSize)) finalPagination.pageSize = pageSize;
    const finalParams = searchParams ? searchParams : params;
    return dispatch(actionCreator.searchByParamsAndPage({ params: finalParams, pagination: finalPagination, api, isAppend }));
  }, [params, pagination, api, isNoMore]);

  const search = useCallback((searchParams: any) => commonSearch({ page: 1, searchParams }), [commonSearch]);
  const refresh = useCallback(() => commonSearch(), [commonSearch]);
  const jumpPage = useCallback((page: number) => commonSearch({ page }), [commonSearch]);
  const changePageSize = useCallback((pageSize: number) => commonSearch({ pageSize }), [commonSearch]);
  const clearParams = useCallback(() => commonSearch({ searchParams: {} }), [commonSearch]);
  const loadMore = useCallback(() => {
    if (pagination.page <= 0) return;
    commonSearch({ page: pagination.page + 1, isAppend: true });
  }, [pagination.page, isNoMore, params]);
  const clearList = () => dispatch(actionCreator.clearList());
  const setList = (list: any[]) => dispatch(actionCreator.setList(list));

  const toolkit = useMemo(() => ({
    search, refresh, jumpPage,
    changePageSize, clearParams,
    loadMore, clearList, setList,
  }), [search, refresh, jumpPage,
    changePageSize, clearParams,
    loadMore, clearList, setList,]);

  return [state, toolkit as any];
}

export default useDrawer;
