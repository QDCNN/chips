import PQueue from '@/queue/p-queue';

export const getPromise = () => {
  let ref = null;
  return callback => {
    if (callback) ref = callback();
    return ref;
  }
}

export const formDictionaryQueue = new PQueue({ concurrency: 1 });
export const loginQueue = new PQueue({ concurrency: 1 });
