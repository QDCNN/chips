import numeral from 'numeral';
import Taro from '@tarojs/taro';
import { createContext, runInContext } from '@/compiler';
import objectPath from 'object-path';
import dayjs from 'dayjs';
import { combineQuery } from '@/utils/route';

export const simpleCompiler = (expression, scope) => {
  // const result = singleCompiler(expression, { ...scope });
  let usedExpression = expression;
  if (/^function\(\)/.test(expression)) usedExpression = usedExpression.replace(/^function\(\)/, 'function anonymous()')

  usedExpression = 'module.exports = ' + usedExpression;

  const context = createContext({
    Taro,
    $library: {
      numeral,
      dayjs,
    },
    $shared: {
      combineQuery,
    },
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

  if ((!execResult || !execResult[1]) && pathStr.split('.').length <= 1) return objectGetByPath(schema.properties, pathStr);

  const pathList = pathStr.split(execResult ? execResult[1] : '.');
  let property = schema;
  for (let i = 0; i < pathList.length; i++) {
    const path = pathList[i];
    property = objectGetByPath(property.properties, path);
    if (property && property.type === 'array') return getSchemaFromPath(property.items, pathList[i + 1])
  }
  return property;
}
