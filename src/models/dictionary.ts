import { CommonApi } from '@/api'
import { formDictionaryQueue } from '@/queue'
import create from 'zustand'
import produce from 'immer'
import { scope } from './file-document'
import cloneDeep from 'clone-deep'

export enum DictionaryProperty {
  省市 = 'area_city',
  省市区 = 'region',
  落户方式 = 'settlement_method',
  申请人基本信息 = 'basic',
  家庭成员及主要社会关系 = 'family',
  户口迁入信息 = 'hukou_movein',
  档案信息 = 'archive',
  教育经历 = 'education',
  子女信息 = 'children',
  配偶信息 = 'spouse_basic'
  // 需要增加配偶字段表
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
  [DictionaryProperty.配偶信息]: {},
}

interface DictionaryState {
  state: {},
  actions: {
    init: () => Promise<void>;
    fetchSettlementMethod: () => Promise<void>;
    fetchAreaCity: () => Promise<void>;
    fetchRegion: () => Promise<void>;
    fetchBasic: () => Promise<void>;
    fetchFamily: () => Promise<void>;
    fetchHukouMovein: () => Promise<void>;
    fetchArchive: () => Promise<void>;
    fetchEducation: () => Promise<void>;
    fetchChildren: () => Promise<void>;
    fetchSpouseBasic: () => Promise<void>;
  }
}

export const useDictionaryState = create<DictionaryState>((set, get) => ({
  state: {},
  actions: {
    async init() {
      const { actions } = get();
      formDictionaryQueue.add(async () => {
        const promiseList = [
          actions.fetchSettlementMethod(),
          actions.fetchAreaCity(),
          actions.fetchRegion(),
          actions.fetchBasic(),
          actions.fetchFamily(),
          actions.fetchHukouMovein(),
          actions.fetchArchive(),
          actions.fetchEducation(),
          actions.fetchChildren(),
          actions.fetchSpouseBasic(),
        ];
        await Promise.all(promiseList);
        scope.$dictionary = cloneDeep(get().state);
      });
    },
    async fetchSettlementMethod() {
      const response = await CommonApi.getESSettlementMethod();
      set(produce(draft => {
        draft.state[DictionaryProperty.落户方式] = response.data;
      }));
      // dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.落户方式, value: response.data }));
      // scope.$dictionary[DictionaryProperty.落户方式] = response.data;
    },
    async fetchAreaCity() {
      const response = await CommonApi.getESAreaCity();
      set(produce(draft => {
        draft.state[DictionaryProperty.省市] = response.data;
      }));
      // dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.省市, value: response.data }));
      // scope.$dictionary[DictionaryProperty.省市] = response.data;
    },
    async fetchRegion() {
      const response = await CommonApi.getESRegion();
      set(produce(draft => {
        draft.state[DictionaryProperty.省市区] = response.data;
      }));
      // dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.省市区, value: response.data }));
      // scope.$dictionary[DictionaryProperty.省市区] = response.data;
    },
    async fetchBasic() {
      const response = await CommonApi.getESBasic();
      set(produce(draft => {
        draft.state[DictionaryProperty.申请人基本信息] = response.data;
      }));
      // dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.申请人基本信息, value: response.data }));
      // scope.$dictionary[DictionaryProperty.申请人基本信息] = response.data;
    },
    async fetchFamily() {
      const response = await CommonApi.getESFamily();
      set(produce(draft => {
        draft.state[DictionaryProperty.家庭成员及主要社会关系] = response.data;
      }));
      // dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.家庭成员及主要社会关系, value: response.data }));
      // scope.$dictionary[DictionaryProperty.家庭成员及主要社会关系] = response.data;
    },
    async fetchHukouMovein() {
      const response = await CommonApi.getESHukouMovein();
      set(produce(draft => {
        draft.state[DictionaryProperty.户口迁入信息] = response.data;
      }));
      // dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.户口迁入信息, value: response.data }));
      // scope.$dictionary[DictionaryProperty.户口迁入信息] = response.data;
    },
    async fetchArchive() {
      const response = await CommonApi.getESArchive();
      set(produce(draft => {
        draft.state[DictionaryProperty.档案信息] = response.data;
      }));
      // dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.档案信息, value: response.data }));
      // scope.$dictionary[DictionaryProperty.档案信息] = response.data;
    },
    async fetchEducation() {
      const response = await CommonApi.getESEducation();
      set(produce(draft => {
        draft.state[DictionaryProperty.教育经历] = response.data;
      }));
      // dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.教育经历, value: response.data }));
      // scope.$dictionary[DictionaryProperty.教育经历] = response.data;
    },
    async fetchChildren() {
      const response = await CommonApi.getESChildren();
      set(produce(draft => {
        draft.state[DictionaryProperty.子女信息] = response.data;
      }));
      // dispatch(actionCreator.dictionary.setCommonItem({ key: DictionaryProperty.子女信息, value: response.data }));
      // scope.$dictionary[DictionaryProperty.子女信息] = response.data;
    },
    async fetchSpouseBasic() {
      const response = await CommonApi.getESSpouseBasic();
      set(produce(draft => {
        draft.state[DictionaryProperty.配偶信息] = response.data;
      }));
    }
  }
}))
// const dictionaryModel = {
//   state: () => initialState,
//   reducers: () => ({
//     setCommonItem(state, payload) {
//       state[payload.key] = payload.value
//     }
//   }),
//   effects: (dispatch, getState, delay) => ({
//   })
// }


// export default dictionaryModel
