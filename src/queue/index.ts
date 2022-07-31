import PQueue from '@/queue/p-queue';

export const getPromise = () => {
  let ref = null;
  return callback => {
    if (callback) ref = callback();
    return ref;
  }
}

export const loginQueue: (callback?) => Promise<any> = getPromise();
// export const singlePromise: (callback?) => Promise<any> = getPromise();
export const formDictionaryQueue = new PQueue();
export const formOncePromise: (callback?) => Promise<any> = getPromise();
