import numeral from 'numeral';
import Taro from '@tarojs/taro';
import { createContext, runInContext } from '@/compiler';
import cloneDeep from 'clone-deep';
import objectPath from 'object-path';

export const simpleCompiler = (expression, scope) => {
  // const result = singleCompiler(expression, { ...scope });
  let usedExpression = expression;
  if (/^function\(\)/.test(expression)) usedExpression = usedExpression.replace(/^function\(\)/, 'function anonymous()')

  usedExpression = 'module.exports = ' + usedExpression;

  const context = createContext({
    numeral,
    Taro,
    ...scope
  });
  // console.log('simpleCompiler before: ', expression, scope)
  const result = runInContext(usedExpression, context)
  // console.log('simpleCompiler after: ', expression, scope, result);
  return result;
}

export const calcPattern = ($self, $page) => {
  if (!$self?.props?.name) return 'editable';
  const config = $page.taskDetail.config;
  const prefix = $self.path.entire.split('.').shift();
  const itemConfig = config[prefix];
  if (itemConfig == 0) return 'disabled';
  return 'editable';
}

export const objectGetByPath = (object, path) => {
  if (object[path]) return object[path];
  return objectPath.get(object, path);
}

export const getSchemaFromPath = (schema, pathStr) => {
  const execResult = /(\.\d\.)/.exec(pathStr);

  if (!execResult || !execResult[1]) return objectGetByPath(schema.properties, pathStr);

  const pathList = pathStr.split(execResult[1]);
  for (let i = 0; i < pathList.length; i++) {
    const path = pathList[i];
    const property = objectGetByPath(schema.properties, path);
    if (property.type === 'array') return getSchemaFromPath(property.items, pathList[i + 1])
    i++;
  }
}
