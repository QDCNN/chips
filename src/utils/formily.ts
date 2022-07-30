import objectPath from 'object-path'

export const getFullName = (field) => {
  let path = '';
  if (field.props.basePath) {
    path += field.props.basePath?.entire + '.';
  }
  path += field.props.name;
  return path;
}

const isTrue = text => text === 'true';
const isFalse = text => text === 'false';
const isObject = text => /^{[^}]*}$/.test(text);
const isTernaryExpression = text => /[^?:]*\?[^?:]*:/.test(text);
const isJudgmentStatement = text => /===|==|!=|!==/.test(text);
const isAddStatement = text => /\+/.test(text);
const isString = text => /^"|'/.test(text);
const isNumber = text => /^\d+\d?$/.test(text);
const isFunctionCall = text => /\([^()]*\)/.test(text);

// if (item.includes('...')) {
//   const extObj = objectPath.get(scopeObj, item.replace('...', ''));
//   console.log('extObj: ', { ...scopeObj }, item.replace('...', ''));
//   for (const key in extObj) {
//     resultObj[key] = extObj[key];
//   }
//   continue;
// }

const handleObject = (expression, scope) => {
  const resultObj = {};
  const handledObjText = expression.replace(/^{/, '').replace(/}$/, '');

  for (const item of handledObjText.split(',')) {
    const [_, key, value] = /([^:]*):(.*)/.exec(item);
    resultObj[key.trim()] = handleSingleItem(value, scope);
  }
  return resultObj;
}

const handleTernaryExpression = (expression, scope) => {
  const [_, exp1, exp2, exp3] = /([^?:]*)\?([^:]*):(.*)/.exec(expression);
  const exp1Result = handleSingleItem(exp1, scope);
  const exp2Result = handleSingleItem(exp2, scope);
  if (exp1Result) return exp2Result;
  return handleSingleItem(exp3, scope);
}

const handleJudgmentStatement = (expression, scope) => {
  const [_, exp1, exp2, exp3] = /([^=]*)(===|==|!=|!==)([^=]*)/.exec(expression);
  if (exp2 == '===') return handleSingleItem(exp1, scope) === handleSingleItem(exp3, scope)
  if (exp2 == '==') return handleSingleItem(exp1, scope) == handleSingleItem(exp3, scope)
  if (exp2 == '!=') return handleSingleItem(exp1, scope) != handleSingleItem(exp3, scope)
  if (exp2 == '!==') return handleSingleItem(exp1, scope) !== handleSingleItem(exp3, scope)
  return '';
}

const handleAddStatement = (expression, scope) => {
  return expression.split('+').reduce((prev, current) => prev + handleAddStatement(current, scope), null);
}

const handleString = (expression) => {
  return /([^"']+)/.exec(expression)[1];
}

const handleFunctionCall = (expression, scope) => {
  const [_, variable, funcCall] = /(.*)\.([^.]+)$/.exec(expression);
  const [_2, funcName, args] = /([^(]+)\(([^()]*)\)$/.exec(funcCall);
  const handledArgs = args ? args.split(',').map(item => handleSingleItem(item, scope)) : [];
  const target = handleSingleItem(variable, scope);
  return target[funcName].apply(target, handledArgs);
}

const handleSingleItem = (expression, scope) => {
  const trimExpression = expression.trim();
  if (isObject(trimExpression)) return handleObject(trimExpression, scope);
  if (isTernaryExpression(trimExpression)) return handleTernaryExpression(trimExpression, scope);
  if (isJudgmentStatement(trimExpression)) return handleJudgmentStatement(trimExpression, scope);
  if (isAddStatement(trimExpression)) return handleAddStatement(trimExpression, scope);
  if (isString(trimExpression)) return handleString(trimExpression);
  if (isNumber(trimExpression)) return Number(trimExpression);
  if (isTrue(trimExpression)) return true;
  if (isFalse(trimExpression)) return false;
  if (isFunctionCall(trimExpression)) return handleFunctionCall(trimExpression, scope);
  return objectPath.get(scope, trimExpression);
}

export const simpleCompiler = (expression, scope) => {
  // const scopeObj = { ...scope };
  // console.log(expression, scope);
  const result = handleSingleItem(expression, scope);
  // console.log('result: ', result);
  return result;
}

export const getSchemaFromPath = (schema, pathStr) => {
  const execResult = /(\.\d\.)/.exec(pathStr);

  if (!execResult || !execResult[1]) return objectPath.get(schema.properties[pathStr])

  const pathList = pathStr.split(execResult[1]);
  for (let i = 0; i < pathList.length; i++) {
    const path = pathList[i];
    const property = objectPath.get(schema.properties[path]);
    if (property.type === 'array') return getSchemaFromPath(property.items, pathList[i + 1])
    i++;
  }
}
