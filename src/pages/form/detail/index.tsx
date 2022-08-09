import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
// import React, { useEffect, useMemo, useState } from 'react'
import { View, Form } from '@tarojs/components'
import { createForm, onFormSubmit } from '@formily/core'
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
import { getSchemaFromPath, simpleCompiler } from '@/utils/formily'
import { scope } from '@/models/file-document'


Schema.registerCompiler(simpleCompiler);

// const form = createForm();

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

// const scope = observable({
//   $params: {},
//   $fullForm: {},
//   $business: { user: { name: '', phone: '' } },
//   $dictionary: { ...initialState },
//   $task: { review_user: {}, service_user: {} }
// });

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
  const { fileDocument } = useSelector((store: RootState) => store);
  const [pageStructure, setPageStructure] = useState({ form: {}, schema: {} });
  const form = useMemo(() => createForm(), []);
  const dispatch = useDispatch();
  const { params } = useRouter();

  useDidShow(() => {
    initPage();

    const title = params.title ? decodeURIComponent(params.title) : '';
    // console.log('params: ', decodeURIComponent(params.title));
    Taro.setNavigationBarTitle({ title });
  });

  const handleCustom = () => {
    if (params.type === 'custom') {
      if (typeDataMap[params.name]) {
        setPageStructure(typeDataMap[params.name]);
      }
    } else {
      if (typeDataMap[params.type]) {
        setPageStructure(typeDataMap[params.type]);
      }
    }
    scope.$params = params;
  };

  const handleSpecific = () => {
    const paramsType = params.type || 'input';
    let type = '';
    if (params.type === 'custom') return;

    const fullForm = fileDocument.form.getFormState();
    scope.$fullForm = fullForm;

    type = typeComponentMap[paramsType];

    const pathSchema = getSchemaFromPath(fileDocument.pageStructure.schema, params.name);
    const currentSchema = merge.recursive({}, { ...pathSchema, properties: { ...pathSchema.properties } }, {
      'x-component': type,
      'x-index': 0,
      name: params.name,
    });
    const fullSchema = merge({}, { ...typeDataMap[paramsType] }, {
      schema: {
        properties: {
          ...typeDataMap[paramsType].schema.properties,
          [currentSchema.name]: currentSchema,
        }
      }
    });

    // console.log('fullSchema: ', fullSchema);

    const matchValue = objectPath.get(fullForm.values, params.name);
    if (matchValue) form.setValuesIn(params.name, matchValue);

    setPageStructure(fullSchema);
  };

  const initPage = () => {

    handleCustom();
    handleSpecific();
  };

  // useDidHide(() => {
  //   form.clearFormGraph('*');
  //   setPageStructure({ form: {}, schema: {} });
  // });

  const onSubmit = async (e) => {
    for (const key of Object.keys(e.detail.value)) {
      // console.log('key: ', key);
      fileDocument.form.setValuesIn(key, e.detail.value[key]);
    }
    // const fullFormValues = fileDocument.form.getValuesIn('*');
    // console.log('formValue： ', formValue);
    // const fullForm = fileDocument.form.getFormState();
    // dispatch(actionCreator.fileDocument.saveTempValue(merge({}, fullFormValues)));
    // fileDocument.form.setValues(formValue);
    Taro.navigateBack();
  }

  return (
    <View className={styles.page} style={pageStructure.form.style} data-weui-theme="light">
      <Form onSubmit={onSubmit}>
        <FormProvider form={form}>
          <SchemaField schema={pageStructure.schema} scope={scope}></SchemaField>
        </FormProvider>
      </Form>
    </View>
  )
}

export default FormDetailPage;
