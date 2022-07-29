import { useRouter } from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
// import React, { useEffect, useMemo, useState } from 'react'
import { View, Form, Label } from '@tarojs/components'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField, Schema } from '@formily/react'
import { Switch, Input, Picker, Text, Cell, LinkCell, Button, Radio, Image } from '@/formily-components'
// import { Textarea } from '@/components'
import '@/weui/style/weui.less'
import styles from './index.module.less'
import inputData from './schema/input.json'
import radioData from './schema/radio.json'
import contractData from './schema/contract.json'
import reviewUserWorkData from './schema/review_user.work_card.json'
import serviceUserWorkData from './schema/service_user.work_card.json'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { initialState } from '@/models/dictionary'
import { observable } from '@formily/reactive'
import objectPath from 'object-path'

// import { DictionaryProperty } from '@/models/dictionary'
// import * as lodash from 'lodash'

const handleSingleItem = (expression, scope) => {
  if (expression.includes('+')) {
    expression.split('+').map(item => {
      if (item.includes('"')) return /"(.*)"/.exec(item)[1];
      return scope[item.trim()];
    })
  }
  if (expression.includes('"')) return /"(.*)"/.exec(expression)[1];
  return objectPath.get(scope, expression.trim())
}

Schema.registerCompiler((expression: any, scope?: any) => {
  const scopeObj = { ...scope };
  if (/{/.test(expression)) {
    const resultObj = {};
    const matched = expression.replace(/^{/, '').replace(/}$/, '');

    for (const item of matched.split(',')) {
      if (item.includes('...')) {
        const extObj = objectPath.get(scopeObj, item.replace('...', ''));
        console.log('extObj: ', { ...scopeObj }, item.replace('...', ''));
        for (const key in extObj) {
          resultObj[key] = extObj[key];
        }
        continue;
      }
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
  'radio': radioData,
  'contract': contractData,
  'review_user.work': reviewUserWorkData,
  'service_user.work_card': serviceUserWorkData,
}

const FormDetailPage = () => {
  const { dictionary, fileDocument } = useSelector((store: RootState) => store);
  const [pageStructure, setPageStructure] = useState({ form: {}, schema: {} });
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

  return (
    <View className={styles.page} style={pageStructure.form.style} data-weui-theme="light">
      {/* <Radio options={[{ label: '1', value: '1' }, { label: '1', value: '1' }]} /> */}
      {/* <Textarea maxLength={200} showCounter /> */}

      <Form>
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
