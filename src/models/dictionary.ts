import * as serviceAPI from '@/api/service'
import { actionCreator, RootState, store } from '@/store';

export enum DictionaryProperty {
  落户方式 = 'settlement_method',
  申请人基本信息 = 'basic',
  家庭成员及主要社会关系 = 'family',
  户口迁入信息 = 'hukou_movein',
  档案信息 = 'archive',
  教育经历 = 'education',
  子女信息 = 'children',
}

export const initialState = {
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
      dispatch(actionCreator.dictionary.fetchSettlementMethod());
      dispatch(actionCreator.dictionary.fetchBasic());
      dispatch(actionCreator.dictionary.fetchFamily());
      dispatch(actionCreator.dictionary.fetchHukouMovein());
      dispatch(actionCreator.dictionary.fetchArchive());
      dispatch(actionCreator.dictionary.fetchEducation());
      dispatch(actionCreator.dictionary.fetchChildren());
    },
    async fetchSettlementMethod() {
      const response = await serviceAPI.getESSettlementMethod();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.落户方式, value: response.data }));
    },
    async fetchBasic() {
      const response = await serviceAPI.getESBasic();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.申请人基本信息, value: response.data }));
    },
    async fetchFamily() {
      const response = await serviceAPI.getESFamily();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.家庭成员及主要社会关系, value: response.data }));
    },
    async fetchHukouMovein() {
      const response = await serviceAPI.getESHukouMovein();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.户口迁入信息, value: response.data }));
    },
    async fetchArchive() {
      const response = await serviceAPI.getESArchive();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.档案信息, value: response.data }));
    },
    async fetchEducation() {
      const response = await serviceAPI.getESEducation();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.教育经历, value: response.data }));
    },
    async fetchChildren() {
      const response = await serviceAPI.getESChildren();
      dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.子女信息, value: response.data }));
    },
  })
}


export default dictionaryModel
