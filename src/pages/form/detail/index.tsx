import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
// import React, { useEffect, useMemo, useState } from 'react'
import { View, Form } from '@tarojs/components'
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

const form = createForm();

const FormDetailPage = () => {
  const { dictionary, fileDocument } = useSelector((store: RootState) => store);
  const [pageStructure, setPageStructure] = useState({ form: {}, schema: {} });
  const dispatch = useDispatch();
  const { params } = useRouter();

  useDidShow(() => {
    initPage();
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
    form.clearFormGraph('*');

    const fullForm = fileDocument.form.getFormState();
    scope.$fullForm = fullForm;

    type = typeComponentMap[paramsType];

    const pathSchema = getSchemaFromPath(fileDocument.pageStructure.schema, params.name);
    const currentSchema = merge.recursive({}, pathSchema, {
      'x-component': type,
      'x-index': 0,
      name: params.name,
    });
    const fullSchema = merge.recursive({}, typeDataMap[paramsType], {
      schema: {
        properties: {
          [currentSchema.name]: currentSchema
        }
      }
    });

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

  const onSubmit = async () => {
    const formValue = await form.submit();
    const fullForm = fileDocument.form.getFormState();
    dispatch(actionCreator.fileDocument.saveTempValue(merge.recursive({}, fullForm.values, formValue)));
    fileDocument.form.setValues(formValue);
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
