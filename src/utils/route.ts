import qs, { IStringifyOptions } from 'qs';

export function combineQuery(path: string, query: any, stringifyOptions?: IStringifyOptions) {
  let finalPath = path;
  if (query) finalPath += '?' + qs.stringify(query, stringifyOptions);

  return finalPath;
}
