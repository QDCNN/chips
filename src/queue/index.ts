export const getPromise = () => {
  let ref = null;
  return callback => {
    if (callback) ref = callback();
    return ref;
  }
}

export const loginQueue: (callback?) => Promise<any> = getPromise();
// export const singlePromise: (callback?) => Promise<any> = getPromise();
