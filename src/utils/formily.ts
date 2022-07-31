import objectPath from 'object-path'

const globalScope: { [key: string]: any } = {
  console,

  setTimeout,
  setInterval,

  clearTimeout,
  clearInterval,

  encodeURI,
  encodeURIComponent,
  decodeURI,
  decodeURIComponent,
  escape,
  unescape,

  Infinity,
  NaN,
  isFinite,
  isNaN,
  parseFloat,
  parseInt,
  Object,
  Boolean,
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
  Number,
  Math,
  Date,
  String,
  RegExp,
  Array,
  JSON,
  Promise
}

export const getFullName = (field) => {
  let path = '';
  if (field.props.basePath) {
    path += field.props.basePath?.entire + '.';
  }
  path += field.props.name;
  return path;
}

const charCount = (text, judgeCharacter) => {
  let count = 0;
  for (const character of text) {
    if (character === judgeCharacter) count++;
  }
  return count;
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
const isFunctionChain = text => charCount(text, '(') > 1;
const isGlobalVar = text => globalScope[text];

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
    resultObj[key.trim()] = singleCompiler(value, scope);
  }
  return resultObj;
}

const handleTernaryExpression = (expression, scope) => {
  const [_, exp1, exp2, exp3] = /([^?:]*)\?([^:]*):(.*)/.exec(expression);
  const exp1Result = singleCompiler(exp1, scope);
  const exp2Result = singleCompiler(exp2, scope);
  if (exp1Result) return exp2Result;
  return singleCompiler(exp3, scope);
}

const handleJudgmentStatement = (expression, scope) => {
  const [_, exp1, exp2, exp3] = /([^=]*)(===|==|!=|!==)([^=]*)/.exec(expression);
  if (exp2 == '===') return singleCompiler(exp1, scope) === singleCompiler(exp3, scope)
  if (exp2 == '==') return singleCompiler(exp1, scope) == singleCompiler(exp3, scope)
  if (exp2 == '!=') return singleCompiler(exp1, scope) != singleCompiler(exp3, scope)
  if (exp2 == '!==') return singleCompiler(exp1, scope) !== singleCompiler(exp3, scope)
  return '';
}

const handleAddStatement = (expression, scope) => {
  const expList = expression.split('+');
  const count = expList.length;
  const prev = singleCompiler(expList[0], scope);
  let result = null;
  for (let i = 1; i < count; i++) {
    result = prev + singleCompiler(expList[i], scope);
  }
  return result;
}

const handleString = (expression) => {
  // console.log('handleString: ', expression);
  return /([^"']+)/.exec(expression)[1];
}

const handleFunctionChain = (expression, scope) => {
  const initialFuncCallList = expression.split(').');
  const count = initialFuncCallList.length;
  // const lastItem = initialFuncCallList.pop();
  const funcCallList = initialFuncCallList.map((item, index) => {
    if (index === count - 1) return item;
    return item + ')';
  });

  let result = null;
  const preResult = handleFunctionCall(funcCallList[0], scope);
  // console.log('funcCallList: ', funcCallList);
  for (let i = 1; i < count; i++) {
    result = handleTargetFuncCall(preResult, funcCallList[i], scope);
  }
  return result;
}

const handleTargetFuncCall = (target, expression, scope) => {
  const [_2, funcName, args] = /^([^(]*)\(([^()]+)\)/.exec(expression);
  const handledArgs = args ? args.split(',').map(item => singleCompiler(item, scope)) : [];
  // console.log('handleTargetFuncCall: ', target, expression, scope)
  if (!target) return null;
  const finalTarget = funcName ? target[funcName] : target;
  // console.log('handleTargetFuncCall: ', finalTarget, target, expression, scope)
  const result = finalTarget.apply(target, handledArgs);
  return result;
}

const handleFunctionCall = (expression, scope) => {
  if (isFunctionChain(expression)) return handleFunctionChain(expression, scope);

  const [fullFuncCall, funcCall] = /\.?([^.]+\([^()]+\))$/.exec(expression);
  const variable = expression.replace(fullFuncCall, '');
  const target = singleCompiler(variable, scope);
  // console.log('handleFunctionCall: ', target, expression, variable, { ...scope, $dictionary: { ...scope.$dictionary } })
  return handleTargetFuncCall(target, funcCall, scope);
}

const handleGlobalVar = (expression) => global[expression];

const singleCompiler = (expression, scope) => {
  const trimExpression = typeof expression === 'string' ? expression.trim() : expression;
  if (isObject(trimExpression)) return handleObject(trimExpression, scope);
  if (isTernaryExpression(trimExpression)) return handleTernaryExpression(trimExpression, scope);
  if (isJudgmentStatement(trimExpression)) return handleJudgmentStatement(trimExpression, scope);
  if (isAddStatement(trimExpression)) return handleAddStatement(trimExpression, scope);
  if (isString(trimExpression)) return handleString(trimExpression);
  if (isNumber(trimExpression)) return Number(trimExpression);
  if (isTrue(trimExpression)) return true;
  if (isFalse(trimExpression)) return false;
  if (isFunctionCall(trimExpression)) {
    const functionCallResult = handleFunctionCall(trimExpression, scope);
    return functionCallResult;
  };
  // console.log('trimExpression: ', trimExpression, scope);
  // if (isGlobalVar(trimExpression)) return handleGlobalVar(trimExpression);
  const result = objectPath.get(scope, trimExpression);
  return result;
}

export const simpleCompiler = (expression, scope) => {
  // const scopeObj = { ...scope };
  const result = singleCompiler(expression, scope);
  console.log('simpleCompiler: ', expression, scope, result);
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
