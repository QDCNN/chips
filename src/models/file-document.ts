import * as api from '@/api'
import { actionCreator, store } from '@/store';
import Taro from '@tarojs/taro';
// import Taro from '@tarojs/taro';
// import objectPath from 'object-path'
import { observable } from '@formily/reactive'
import { initialState as dictionaryInitialState } from './dictionary'
import onceInit from 'once-init'
// import { getFullName } from '@/utils/formily'
import { specialHandleProperties } from '@/utils/schema'
import { defaultPageStructure } from '@/default/page-structure'
import cloneDeep from 'clone-deep'
import create from 'zustand'
import produce from 'immer'
import { defaultFormValues } from '@/default/form'
import deepmerge from 'deepmerge'

const onceFetchPageStructure = onceInit(() => api.getPageStructure({ name: 'file-document' }));

export const scope = observable.shallow({
  $params: {},
  $dictionary: { ...dictionaryInitialState },
  $task: { config: {}, review_user: {}, service_user: {} },
  $shared: {
    calcPattern($self, $task) {
      if (!$self?.props?.name) return 'editable';
      const config = {...$task.config};
      const itemConfig = config[$self.props.name.split('.').shift()];
      if (itemConfig == 0) return 'disabled';
      return 'editable';
    }
  }
});

export const initialState = {
  taskId: '',
  mounted: false,
  originPageStructure: cloneDeep(defaultPageStructure),
  pageStructure: cloneDeep(defaultPageStructure),
  task: {},
  formValues: defaultFormValues,
}

interface FileDocumentState {
  domain: typeof initialState,
  toolkit: {
    fetchPageStructure: () => Promise<any>,
    fetchLatestTask: (params: any) => Promise<void>,
    fetchTaskDetail: (params: any) => Promise<void>,
    submitFormValues: (params: any) => Promise<void>,
    setPageStructure: (params: any) => void,
    saveTempValue: (value: any) => Promise<void>
  }
}

export const useFileDocumentState = create<FileDocumentState>((set, get) => ({
  domain: initialState,
  toolkit: {
    async fetchPageStructure() {
      const response = await onceFetchPageStructure.init();
      if (!response.data.content) return;
      const pageStructure = JSON.parse(response.data.content);
      pageStructure.schema.properties = specialHandleProperties({
        properties: pageStructure.schema.properties,
        payload: { key: 'x-pattern', value: '{{$shared.calcPattern($self, $task)}}' }
      });

      set(produce(draft => {
        draft.domain.originPageStructure = pageStructure;
        draft.domain.pageStructure = pageStructure;
      }));

      setTimeout(() => {
        set(produce(draft => {
          draft.domain.mounted = true;
        }));
      }, 0);

      return pageStructure;
    },
    async fetchLatestTask(params) {
      set(produce(draft => {
        draft.domain.mounted = false;
        draft.domain.taskId = params.task_id;
      }));
      const result = await api.获取最近一次表单内容(params);
      set(produce(draft => {
        draft.domain.formValues = deepmerge(defaultFormValues, result.data.content);
      }));
      return result.data.content;
      // form.setInitialValues(result.data.content);
      // form.setValues(result.data.content);
    },
    async saveTempValue(values) {
      const { domain } = get();
      if (!domain.mounted) return;
      Taro.getEnv() === Taro.ENV_TYPE.WEB && Taro.showNavigationBarLoading();
      await api.提交表单内容json({ task_id: domain.taskId, content: JSON.stringify(values) });
      set(produce(draft => {
        draft.domain.formValues = values;
      }));
      Taro.getEnv() === Taro.ENV_TYPE.WEB && Taro.hideNavigationBarLoading();
    },
    async fetchTaskDetail(params) {
      const response = await api.获取任务订单信息(params);
      scope.$task = response.data;
      set(produce(draft => {
        draft.domain.task = response.data;
      }));
    },
    async submitFormValues(params) {
      await api.用户最终提交表单(params);
    },
    setPageStructure(pageStructure) {
      set(produce(draft => {
        draft.domain.pageStructure = pageStructure;
      }));
    }
  }
}));
