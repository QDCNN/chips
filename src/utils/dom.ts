import Taro from '@tarojs/taro';

export const weappBoundingClientRect = (id) => {
  return new Promise((resolve, reject) => {
    Taro.createSelectorQuery()
      .select('#' + id)
      .boundingClientRect((doms: any) => {
        if (!doms) {
          return reject();
        }
        resolve({ ...doms, isOver: doms.top + doms.height < 0, fixed: doms.top <= 0 });
      })
      .exec();
  }) as Promise<any>;
};
