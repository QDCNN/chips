import * as api from '@/api'
import { formDictionaryQueue } from '@/queue'
import { actionCreator, RootState, store } from '@/store'
import { scope } from './file-document'

export enum DictionaryProperty {
  省市 = 'area_city',
  落户方式 = 'settlement_method',
  申请人基本信息 = 'basic',
  家庭成员及主要社会关系 = 'family',
  户口迁入信息 = 'hukou_movein',
  档案信息 = 'archive',
  教育经历 = 'education',
  子女信息 = 'children',
}

export const initialState = {
  [DictionaryProperty.省市]: [],
  [DictionaryProperty.落户方式]: [],
  [DictionaryProperty.申请人基本信息]: { settlement_type: [{ label: '1', value: '1' }] },
  [DictionaryProperty.家庭成员及主要社会关系]: {},
  [DictionaryProperty.户口迁入信息]: {},
  [DictionaryProperty.档案信息]: {},
  [DictionaryProperty.教育经历]: {},
  [DictionaryProperty.子女信息]: {},
}

const dictionaryModel = {
  state: () => initialState,
  reducers: () => ({
    setCommonItem(state, payload) {
      state[payload.key] = payload.value
    }
  }),
  effects: (dispatch, getState, delay) => ({
    async init() {
      formDictionaryQueue.add(async () => {
        await dispatch(actionCreator.dictionary.fetchSettlementMethod());
        await dispatch(actionCreator.dictionary.fetchAreaCity());
        await dispatch(actionCreator.dictionary.fetchBasic());
        await dispatch(actionCreator.dictionary.fetchFamily());
        await dispatch(actionCreator.dictionary.fetchHukouMovein());
        await dispatch(actionCreator.dictionary.fetchArchive());
        await dispatch(actionCreator.dictionary.fetchEducation());
        await dispatch(actionCreator.dictionary.fetchChildren());
      });
    },
    async fetchSettlementMethod() {
      const response = await api.getESSettlementMethod();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.落户方式, value: response.data }));
      scope.$dictionary[DictionaryProperty.落户方式] = response.data;
    },
    async fetchAreaCity() {
      const response = await api.getESAreaCity();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.省市, value: response.data }));
      scope.$dictionary[DictionaryProperty.省市] = response.data;
    },
    async fetchBasic() {
      const response = await api.getESBasic();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.申请人基本信息, value: response.data }));
      scope.$dictionary[DictionaryProperty.申请人基本信息] = response.data;
    },
    async fetchFamily() {
      const response = await api.getESFamily();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.家庭成员及主要社会关系, value: response.data }));
      scope.$dictionary[DictionaryProperty.家庭成员及主要社会关系] = response.data;
    },
    async fetchHukouMovein() {
      const response = await api.getESHukouMovein();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.户口迁入信息, value: response.data }));
      scope.$dictionary[DictionaryProperty.户口迁入信息] = response.data;
    },
    async fetchArchive() {
      const response = await api.getESArchive();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.档案信息, value: response.data }));
      scope.$dictionary[DictionaryProperty.档案信息] = response.data;
    },
    async fetchEducation() {
      const response = await api.getESEducation();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.教育经历, value: response.data }));
      scope.$dictionary[DictionaryProperty.教育经历] = response.data;
    },
    async fetchChildren() {
      const response = await api.getESChildren();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.子女信息, value: response.data }));
      scope.$dictionary[DictionaryProperty.子女信息] = response.data;
    },
  })
}


export default dictionaryModel
