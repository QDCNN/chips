import Taro from '@tarojs/taro';
// import Taro from '@tarojs/taro';
// import objectPath from 'object-path'
import { observable } from '@formily/reactive'
import { initialState as dictionaryInitialState } from './dictionary'
import onceInit from 'once-init'
import { specialHandleProperties } from '@/utils/schema'
import { defaultPageStructure } from '@/default/page-structure'
import cloneDeep from 'clone-deep'
import create from 'zustand'
import produce from 'immer'
import { defaultFormValues } from '@/default/form'
import deepmerge from 'deepmerge'
import { FORM_TEMPLATE_KEY } from '@/constants/form';
import { defaultTaskDetail } from '@/default/task';
import { CommonApi } from '@/api';
import { calcPattern } from '@/utils/formily';

const onceFetchPageStructure = onceInit(() => CommonApi.getPageStructure({ name: FORM_TEMPLATE_KEY }));

export const scope = observable.shallow({
  $params: {},
  $dictionary: { ...dictionaryInitialState },
  $page: {
    taskDetail: { ...defaultTaskDetail }
  },
  $shared: {
    calcPattern
  }
});

export const initialState = {
  taskId: '',
  mounted: false,
  originPageStructure: cloneDeep(defaultPageStructure),
  pageStructure: cloneDeep(defaultPageStructure),
  task: {},
  formValues: defaultFormValues,
  form: null as any,
}

interface FileDocumentState {
  domain: typeof initialState,
  toolkit: {
    fetchPageStructure: () => Promise<any>,
    fetchLatestTask: (params: any) => Promise<void>,
    fetchTaskDetail: (params: any) => Promise<void>,
    submitFormValues: (params: any) => Promise<void>,
    setPageStructure: (params: any) => void,
    saveTempValue: (value: any) => Promise<void>,
    setForm: (form: any) => void,
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
        payload: [
          // 处理 disabled 开关
          { key: 'x-pattern', value: '{{$shared.calcPattern($self, $page)}}' },
          { key: 'x-decorator-props.disabled', value: '{{$shared.calcPattern($self, $page) == "disabled"}}' },
          // 处理 required 显示
          { key: 'x-decorator-props.required', value: '{{!$self.required ? $self.required : ($self.value == undefined || $self.value == "")}}' },
          { key: 'x-component-props.required', value: '{{!$self.required ? $self.required : ($self.value == undefined || $self.value == "")}}' },
        ]
      });

      set(produce(draft => {
        draft.domain.originPageStructure = cloneDeep(pageStructure);
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
      const result = await CommonApi.获取最近一次表单内容(params);
      const nextformValues = deepmerge(defaultFormValues, JSON.parse(result.data.content));
      set(produce(draft => {
        draft.domain.formValues = nextformValues;
      }));
      return result.data.content;
      // form.setInitialValues(result.data.content);
      // form.setValues(result.data.content);
    },
    async saveTempValue(values) {
      const { domain } = get();
      if (!domain.mounted) return;
      Taro.getEnv() === Taro.ENV_TYPE.WEB && Taro.showNavigationBarLoading();
      await CommonApi.提交表单内容json({ task_id: domain.taskId, content: JSON.stringify(values) });
      // set(produce(draft => {
      //   draft.domain.formValues = values;
      // }));
      Taro.getEnv() === Taro.ENV_TYPE.WEB && Taro.hideNavigationBarLoading();
    },
    async fetchTaskDetail(params) {
      const response = await CommonApi.获取任务订单信息(params);
      scope.$page = { taskDetail: response.data };
      set(produce(draft => {
        draft.domain.task = response.data;
      }));
    },
    async submitFormValues(params) {
      await CommonApi.用户最终提交表单(params);
    },
    setPageStructure(pageStructure) {
      set(produce(draft => {
        draft.domain.pageStructure = pageStructure;
      }));
    },
    setForm(form) {
      set(produce(draft => {
        draft.domain.form = form;
      }));
    }
  }
}));
