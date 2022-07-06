import { Dispatch } from 'react';
import { createImmerPlugin } from '@/use-dura/immer';
import { createLoadingPlugin, ExtractLoadingState } from '@/use-dura/loading';
import originUseDura from '@/use-dura/taro';
import { ActionCreator, Model } from '@/use-dura/types';
import Taro from '@tarojs/taro';

export const handleError = error => {
  console.error(error);
  setTimeout(() => {
    Taro.showToast({ title: error.message || error.msg || '服务器错误，稍后再试', icon: 'none', duration: 2000 });
  }, 500);
  throw error;
};

function useDura<M extends Model>(model: M): {
  state: ReturnType<M['state']> & ExtractLoadingState<M>,
  dispatch: Dispatch<any>,
  actionCreator: ActionCreator<M>,
} {
  const options = {
    plugins: [createImmerPlugin(), createLoadingPlugin(model)],
    onError: handleError
  };
  return originUseDura(model, options);
}

export function useDuraArray<M extends Model>(model: M): [
  ReturnType<M['state']> & ExtractLoadingState<M>,
  Dispatch<any>,
  ActionCreator<M>,
] {
  const options = {
    plugins: [createImmerPlugin(), createLoadingPlugin(model)],
    onError: handleError
  };
  const { state, dispatch,actionCreator } = originUseDura(model, options);
  return [state, dispatch, actionCreator];
}

export default useDura;
