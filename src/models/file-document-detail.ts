import * as api from '@/api'
import { actionCreator } from '@/store';
import { observable } from '@formily/reactive';

const defaultPageStructure = {
  form: { style: {} },
  schema: {}
};

export const initialState = {
  cache: {},
  pageStructure: defaultPageStructure,
}

export const fileDocumentDetailObserve = observable.deep({
  pageStructure: defaultPageStructure,
});

const fileDocumentDetail = {
  state: () => initialState,
  reducers: () => ({
    setPageStructure(state, pageStructure) {
      state.pageStructure = pageStructure;
    }
  }),
  effects: (dispatch, getState, delay) => ({
    async fetchPageStructure(name) {
      const response = await api.getPageStructure({ name });
      const pageStructure = JSON.parse(response.data.content);
      dispatch(actionCreator.fileDocumentDetail.setPageStructure(pageStructure));
      // fileDocumentDetailObserve.pageStructure.schema = pageStructure.schema;
      // fileDocumentDetailObserve.pageStructure.form = pageStructure.form;

      // const response = await onceFetchPageStructure.init();
      // if (!response.data.content) return;
      // const pageStructureObj = JSON.parse(response.data.content);
      // pageStructureObj.schema.properties = specialHandleProperties({ properties: pageStructureObj.schema.properties, payload: { key: 'x-pattern', value: '{{$shared.calcPattern($self, $task)}}' } })
      // dispatch(actionCreator.fileDocument.setPageStructure(pageStructureObj));

      // setTimeout(() => {
      //   store.dispatch(actionCreator.fileDocument.setMounted(true));
      // }, 0);
    },
  })
}

export default fileDocumentDetail;
