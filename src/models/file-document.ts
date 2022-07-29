import * as api from '@/api'
import { actionCreator, store } from '@/store';
import { createForm, onFormMount, onFieldValueChange } from '@formily/core';
// import Taro from '@tarojs/taro';
import objectPath from 'object-path'
// import { actionCreator, RootState, store } from '@/store';

const form = createForm({
  effects() {
    // onFormMount(() => {
    //   console.log('onFieldInitialValueChange')
    //   store.dispatch(actionCreator.fileDocument.setMounted(true));
    // })
    onFieldValueChange('*', field => {
      const formValue = {};
      objectPath.set(formValue, field.props.name, field.value);
      store.dispatch(actionCreator.fileDocument.saveTempValue(formValue))
    })
  }
});

export const initialState = {
  taskId: '',
  mounted: false,
  pageStructure: {
    form: { style: {} },
    schema: {}
  },
  task: {},
  form,
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
    }
  }),
  effects: (dispatch, getState, delay) => ({
    async fetchPageStructure() {
      const response = await api.getPageStructure({ name: 'file-document' });
      if (!response.data.content) return;
      dispatch(actionCreator.fileDocument.setPageStructure(JSON.parse(response.data.content)));

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
      // Taro.showNavigationBarLoading();
      await api.提交表单内容json({ task_id: state.fileDocument.taskId, content: JSON.stringify(contentObj) });
      // Taro.hideNavigationBarLoading();
    },
    async fetchTaskDetail(params) {
      const response = await api.获取任务订单信息(params);
      dispatch(actionCreator.fileDocument.setTask(response.data));
    }
  })
}


export default fileDocument