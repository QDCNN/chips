import Taro, { useRouter } from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
// import React, { useEffect, useMemo, useState } from 'react'
import { View, Form, Label } from '@tarojs/components'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField, Schema } from '@formily/react'
import { Switch, Input, Picker, Text, Cell, LinkCell, Button, Radio, Image, Textarea } from '@/formily-components'
import '@/weui/style/weui.less'
import styles from './index.module.less'
import inputData from './schema/input.json'
import radioData from './schema/radio.json'
import contractData from './schema/contract.json'
import reviewUserWorkData from './schema/review_user.work_card.json'
import serviceUserWorkData from './schema/service_user.work_card.json'
import { actionCreator, RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { initialState } from '@/models/dictionary'
import { observable } from '@formily/reactive'
import objectPath from 'object-path'
import merge from 'merge'

const getSchemaFromPath = (schema, pathStr) => {
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

const handleSingleItem = (expression, scope) => {
  if (expression.includes('+')) {
    expression.split('+').map(item => {
      if (item.includes('"')) return /"(.*)"/.exec(item)[1];
      if (item.trim() === 'true') return true;
      if (item.trim() === 'false') return false;
      return scope[item.trim()];
    })
  }
  if (expression.includes('"')) return /"(.*)"/.exec(expression)[1];
  if (expression.trim() === 'true') return true;
  if (expression.trim() === 'false') return false;
  return objectPath.get(scope, expression.trim())
}

Schema.registerCompiler((expression: any, scope?: any) => {
  const scopeObj = { ...scope };
  if (/{/.test(expression)) {
    const resultObj = {};
    const matched = expression.replace(/^{/, '').replace(/}$/, '');

    for (const item of matched.split(',')) {
      // if (item.includes('...')) {
      //   const extObj = objectPath.get(scopeObj, item.replace('...', ''));
      //   console.log('extObj: ', { ...scopeObj }, item.replace('...', ''));
      //   for (const key in extObj) {
      //     resultObj[key] = extObj[key];
      //   }
      //   continue;
      // }
      const [key, value] = item.split(':');
      resultObj[key.trim()] = handleSingleItem(value, scope);
    }
    return resultObj;
  }
  const result = objectPath.get(scopeObj, expression);
  return result;
});

const form = createForm();

const SchemaField = createSchemaField({
  components: {
    Switch,
    Cell,
    Input,
    Textarea,
    Picker,
    Text,
    BaseView: View,
    LinkCell,
    Button,
    Radio,
    Image,
  }
});

const scope = observable({ $params: {}, $business: { user: { name: '', phone: '' } }, $dictionary: { ...initialState }, $task: { review_user: {}, service_user: {} } })

const typeDataMap = {
  'input': inputData,
  'textarea': inputData,
  'radio': radioData,
  'contract': contractData,
  'review_user.work_card': reviewUserWorkData,
  'service_user.work_card': serviceUserWorkData,
}

const typeComponentMap = {
  input: 'Input',
  radio: 'Radio',
  textarea: 'Textarea',
}

const FormDetailPage = () => {
  const { dictionary, fileDocument } = useSelector((store: RootState) => store);
  const [pageStructure, setPageStructure] = useState({ form: {}, schema: {} });
  const dispatch = useDispatch();
  const { params } = useRouter();

  useEffect(() => {
    if (params.type === 'custom') {
      typeDataMap[params.name] && setPageStructure(typeDataMap[params.name])
    } else {
      typeDataMap[params.type] && setPageStructure(typeDataMap[params.type])
    }
    scope.$params = fileDocument.params;
  }, [params]);


  useEffect(() => {
    scope.$dictionary = dictionary;
  }, [dictionary]);
  useEffect(() => {
    scope.$task = fileDocument.task;
  }, [fileDocument.task]);
  useEffect(() => {
    let type = '';
    if (params.type === 'custom') return;
    type = typeComponentMap[params.type];

    const pathSchema = getSchemaFromPath(fileDocument.pageStructure.schema, params.name);
    const currentSchema = merge.recursive({}, pathSchema, {
      'x-component': type,
      'x-index': 0,
      name: params.name,
      'x-component-props': {
        type: pathSchema['x-component-props'].inputType
      }
    });
    const matchedData = typeDataMap[params.type];

    matchedData.schema.properties[currentSchema.name] = currentSchema;
    setPageStructure(matchedData);
  }, [fileDocument.pageStructure])

  const onSubmit = async () => {
    const formValue = await form.submit();
    const fullForm = fileDocument.form.getFormState();
    dispatch(actionCreator.fileDocument.saveTempValue(merge.recursive(fullForm.values, formValue)));
    Taro.navigateBack();
  }

  return (
    <View className={styles.page} style={pageStructure.form.style} data-weui-theme="light">
      <Form onSubmit={onSubmit}>
        <FormProvider form={form}>
          <View>
            <SchemaField schema={pageStructure.schema} scope={scope}></SchemaField>
          </View>
        </FormProvider>
      </Form>
    </View>
  )
}

export default FormDetailPage;
