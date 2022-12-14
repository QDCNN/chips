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
import { FORM_TEMPLATE_KEY } from '@/constants/form';
import { defaultTaskDetail } from '@/default/task';
import { CommonApi } from '@/api';
import { calcPattern } from '@/utils/formily';
import { createForm, onFieldInputValueChange } from '@formily/core';

// const onceFetchPageStructure = onceInit(() => CommonApi.getPageStructure({ name: FORM_TEMPLATE_KEY }));

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
  pageName: '',
  task: {},
  formValues: null,
  form: createForm(),
}

interface FileDocumentState {
  domain: typeof initialState,
  toolkit: {
    fetchPageStructure: (name: string) => Promise<any>,
    fetchLatestTask: (params: any) => Promise<void>,
    fetchTaskDetail: (params: any) => Promise<void>,
    submitFormValues: (params: any) => Promise<void>,
    setPageStructure: (params: any) => void,
    saveTempValue: (value: any) => Promise<void>,
    setForm: (form: any) => void,
    setFormValues: (values: any) => void,
  }
}

export const useFileDocumentState = create<FileDocumentState>((set, get) => ({
  domain: initialState,
  toolkit: {
    async fetchPageStructure(name) {
      const response = await CommonApi.getPageStructure({ name });
      if (!response.data.content) return;
      const pageStructure = JSON.parse(response.data.content);
      pageStructure.schema.properties = specialHandleProperties({
        properties: pageStructure.schema.properties,
        payload: [
          // ?????? disabled ??????
          { key: 'x-pattern', value: '{{$shared.calcPattern($self, $page)}}' },
          { key: 'x-decorator-props.disabled', value: '{{$shared.calcPattern($self, $page) == "disabled"}}' },
          // ?????? required ??????
          { key: 'x-decorator-props.required', value: '{{!$self.required ? $self.required : ($self.value == undefined || $self.value == "")}}' },
          { key: 'x-component-props.required', value: '{{!$self.required ? $self.required : ($self.value == undefined || $self.value == "")}}' },
        ]
      });

      set(produce(draft => {
        draft.domain.originPageStructure = cloneDeep(pageStructure);
        draft.domain.pageStructure = pageStructure;
        draft.domain.pageName = name;
      }));

      setTimeout(() => {
        set(produce(draft => {
          draft.domain.mounted = true;
        }));
      }, 0);

      return pageStructure;
    },
    async fetchLatestTask(params) {
      const { domain, toolkit } = get();
      set(produce(draft => {
        draft.domain.mounted = false;
      }));
      const result = await CommonApi.??????????????????????????????(params);
      const nextformValues = JSON.parse(result.data.content);
      const form = createForm({
        initialValues: cloneDeep(nextformValues),
        effects() {
          onFieldInputValueChange('*', (field, $form) => {
            toolkit.saveTempValue($form.getFormState().values);
          });
        }
      });
      set(produce(draft => {
        draft.domain.form = form;
        draft.domain.taskId = params.task_id;
        draft.domain.formValues = nextformValues;
      }));
      return result.data.content;
    },
    async saveTempValue(values) {
      const { domain } = get();
      if (!domain.mounted) return;
      Taro.getEnv() !== Taro.ENV_TYPE.WEB && Taro.showNavigationBarLoading();
      await CommonApi.??????????????????json({ task_id: domain.taskId, content: JSON.stringify(values) });
      set(produce(draft => {
        draft.domain.formValues = values;
      }));
      Taro.getEnv() !== Taro.ENV_TYPE.WEB && Taro.hideNavigationBarLoading();
    },
    async fetchTaskDetail(params) {
      const response = await CommonApi.????????????????????????(params);
      scope.$page = { taskDetail: response.data };
      set(produce(draft => {
        draft.domain.task = response.data;
      }));
    },
    async submitFormValues(params) {
      await CommonApi.????????????????????????(params);
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
    },
    setFormValues(values) {
      set(produce(draft => {
        draft.domain.formValues = values;
      }));
    }
  }
}));
