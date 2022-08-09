import * as api from '@/api'
import { actionCreator, store } from '@/store';
import { createForm, onFormMount, onFieldValueChange } from '@formily/core';
import Taro from '@tarojs/taro';
// import Taro from '@tarojs/taro';
import objectPath from 'object-path'
import data from './data.json'
import { observable } from '@formily/reactive'
import { initialState as dictionaryInitialState } from './dictionary'
import onceInit from 'once-init'
import { getFullName } from '@/utils/formily';
// import { actionCreator, RootState, store } from '@/store';

const onceFetchPageStructure = onceInit(async () => {
  return await api.getPageStructure({ name: 'file-document' });
});

const form = createForm({
  effects() {
    // onFormMount(() => {
    //   console.log('onFieldInitialValueChange')
    //   store.dispatch(actionCreator.fileDocument.setMounted(true));
    // })
    onFieldValueChange('*', (field, $form) => {
      const fullForm = { ...$form.getFormState().values };
      objectPath.set(fullForm, getFullName(field), field.value);
      store.dispatch(actionCreator.fileDocument.saveTempValue(fullForm))
    })
  }
});

export const scope = observable.shallow({
  $params: {},
  $fullForm: {},
  $dictionary: { ...dictionaryInitialState },
  $task: { review_user: {}, service_user: {} }
});

export const initialState = {
  taskId: '',
  mounted: false,
  // pageStructure: data,
  pageStructure: {
    form: { style: {} },
    schema: {}
  },
  task: {},
  form,
  // scope,
}

const fileDocument = {
  state: () => initialState,
  reducers: () => ({
    setMounted(state, mounted) {
      state.mounted = mounted;
    },
    setTaskId(state, taskId) {
      state.taskId = taskId;
    },
    setPageStructure(state, pageStructure) {
      state.pageStructure = pageStructure;
    },
    setTask(state, task) {
      state.task = task;
    },
  }),
  effects: (dispatch, getState, delay) => ({
    async fetchPageStructure() {
      const response = await onceFetchPageStructure.init();
      if (!response.data.content) return;
      dispatch(actionCreator.fileDocument.setPageStructure(JSON.parse(response.data.content)));
      // dispatch(actionCreator.fileDocument.setPageStructure(data));

      setTimeout(() => {
        store.dispatch(actionCreator.fileDocument.setMounted(true));
      }, 0);
    },
    async fetchLatestTask(params) {
      dispatch(actionCreator.fileDocument.setMounted(false));
      dispatch(actionCreator.fileDocument.setTaskId(params.task_id));
      const result = await api.获取最近一次表单内容(params);
      form.setInitialValues(result.data.content);
    },
    async saveTempValue(contentObj) {
      const state = getState();
      if (!state.fileDocument.mounted) return;
      Taro.getEnv() === Taro.ENV_TYPE.WEB && Taro.showNavigationBarLoading();
      await api.提交表单内容json({ task_id: state.fileDocument.taskId, content: JSON.stringify(contentObj) });
      Taro.getEnv() === Taro.ENV_TYPE.WEB && Taro.hideNavigationBarLoading();
    },
    async fetchTaskDetail(params) {
      const response = await api.获取任务订单信息(params);
      scope.$task = response.data;
      dispatch(actionCreator.fileDocument.setTask(response.data));
    },
    async submitFormValues(params) {
      await api.用户最终提交表单(params);
    }
  })
}

// useEffect(() => {
//   scope.$dictionary = dictionary;
// }, [dictionary]);
// useEffect(() => {
//   scope.$task = fileDocument.task;
// }, [fileDocument.task]);

export default fileDocument
