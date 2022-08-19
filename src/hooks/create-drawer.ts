import create from 'zustand';
import produce from 'immer';
import deepmerge from 'deepmerge';

type API = ({ pagination, params }) => Promise<any>;

export type DrawerState = {
  drawer: {
    list: any[];
    loading: boolean;
    total: number;
    params: any;
    pagination: {
      page: number;
      pageSize: number;
    };
  },

  toolkit: {
    setList: (list: any[]) => void;
    commonSearch: (options?: any) => Promise<any>;
    search: (params?: Parameters<any>[1]) => Promise<any>;
    refresh: () => Promise<any>;
    loadMore: () => Promise<any>;
    changePageSize: (pageSize: number, { triggerRefresh: boolean }?) => void;
    setParams: (params?: Parameters<any>[1]) => void;
    setLoading: (loading: boolean) => void;
    jumpPage: (page: number) => Promise<any>,
  }
}

export const createDrawer = (api: API, options = { defaultValue: {} }) => create<DrawerState>((set, get) => ({
  drawer: deepmerge({
    list: [],
    loading: false,
    total: 0,
    params: {},
    pagination: {
      page: 1,
      pageSize: 50,
    },
  }, options.defaultValue),

  toolkit: {
    commonSearch: async (options = {}) => {
      const state = get();
      const { pagination, params } = state.drawer;
      state.toolkit.setLoading(true);
      const response = await api({ pagination, params });
      const { list, total } = response;
      set(produce((draft: DrawerState) => {
        draft.drawer.list = options.append ? [...draft.drawer.list, ...list] : list;
        draft.drawer.total = total;
        draft.drawer.loading = false;
      }));
      return response;
    },
    search: async (params) => {
      if (params) set(produce(draft => {
        draft.drawer.params = params
      }));
      const state = get();
      return state.toolkit.commonSearch();
    },
    refresh: async () => {
      const state = get();
      return state.toolkit.search(state.drawer.params);
    },
    loadMore: () => {
      const state = get();
      set(produce((draft: DrawerState) => {
        draft.drawer.pagination.page += 1;
      }));
      return state.toolkit.commonSearch({ append: true });
    },
    jumpPage: async (page: number) => {
      const state = get();
      set(produce((draft: DrawerState) => {
        draft.drawer.pagination.page = page;
      }));
      return state.toolkit.search();
    },
    setList: (list: any[]) => {
      set(produce((state: DrawerState) => {
        state.drawer.list = list;
      }));
    },
    changePageSize: (pageSize, options = {}) => {
      const { triggerRefresh = false } = options;
      const state = get();
      set(produce((state: DrawerState) => {
        state.drawer.pagination.pageSize = pageSize;
      }));
      if (triggerRefresh) {
        state.toolkit.refresh();
      }
    },
    setParams: (params: any) => {
      set(produce((state: DrawerState) => {
        state.drawer.params = params;
      }));
    },
    setLoading: (loading: boolean) => {
      set(produce((state: DrawerState) => {
        state.drawer.loading = loading;
      }));
    },
  }
}));
