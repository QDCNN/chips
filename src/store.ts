import global from '@/models/global';

import { createImmerPlugin } from '@dura/immer';
import { create } from '@dura/plus';
import { createActions } from '@dura/actions';
import { ExtractState } from '@dura/types'
import Taro from '@tarojs/taro';

const initialModel = {
  global
};

export type RootModel = typeof initialModel;

export type RootState = ExtractState<RootModel>;


export const handleError = error => {
  console.error(error);
  setTimeout(() => {
    Taro.showToast({ title: error.message || error.msg || '服务器错误，稍后再试', icon: 'none', duration: 2000 });
  }, 500);
  throw error;
};


export const store = create(
  {
    error: handleError,
    initialModel: initialModel,
    compose: window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'],
  },
  {
    immer: createImmerPlugin(),
    // loading: createLoadingPlugin(initialModel),
  }
);

export const actionCreator = createActions(initialModel);
