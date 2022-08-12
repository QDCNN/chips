import Taro, { useDidHide, useDidShow, useRouter } from '@tarojs/taro'
import { useMemo, useState } from 'react'
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
import merge from 'merge'
import { getSchemaFromPath, simpleCompiler } from '@/utils/formily'
import { scope as globalScope } from '@/models/file-document'


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

const scope = observable({
  $params: {},
  $fullForm: {
    values: {},
  },
  $dictionary: { ...initialState },
  $task: { config: {}, review_user: {}, service_user: {} },
  $shared: {
    calcPattern($self, $task) {
      if (!$self?.props?.name) return 'editable';
      const config = { ...$task.config };
      const itemConfig = config[$self.props.name.split('.').shift()];
      if (itemConfig == 0) return 'disabled';
      return 'editable';
    }
  }
});

const typeDataMap = {
  'input': inputData,
  'textarea': inputData,
  'radio': radioData,
  'contract': contractData,
  'review_user.work_card': reviewUserWorkData,
  'service_user.work_card': serviceUserWorkData,
  'fanli': require('./schema/fanli.json'),
  'demo-button': require('./schema/demo-button.json'),
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
    Taro.setNavigationBarTitle({ title });
  });

  const handleCustom = () => {
    if (params.type === 'custom') {
      if (typeDataMap[params.name]) {
        setPageStructure(merge.recursive({}, typeDataMap[params.name]));
      }
    } else {
      if (typeDataMap[params.type]) {
        setPageStructure(merge.recursive({}, typeDataMap[params.type]));
      }
    }
  };

  const handleSpecific = () => {
    const paramsType = params.type || 'input';
    let type = '';
    if (params.type === 'custom') return;

    // const fullForm = fileDocument.form.getFormState();
    // scope.$fullForm.values = fullForm.values;

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
          ...typeDataMap[paramsType].schema.properties,
          [currentSchema.name]: currentSchema,
        }
      }
    });

    console.log('fullSchema: ', fullSchema);

    // const matchValue = objectPath.get(fullForm.values, params.name);
    // console.log('matchValue: ', matchValue);
    // if (matchValue) form.setValuesIn(params.name, matchValue);

    setPageStructure(fullSchema);
  };

  const initPage = () => {
    const fullForm = fileDocument.form.getFormState();
    form.setValues(fullForm.values);

    scope.$dictionary = merge.recursive({}, globalScope.$dictionary);
    scope.$task = merge.recursive({}, globalScope.$task);
    scope.$fullForm.values = merge.recursive({}, fullForm.values);
    scope.$params = params;
    handleCustom();
    handleSpecific();
  };

  useDidHide(() => {
    form.clearFormGraph('*');
    // setPageStructure({ form: {}, schema: {} });
  });

  const onSubmit = async (e) => {
    const validateResult = await form.validate();
    console.log('validateResult: ', validateResult);
    // const fullFormValues = fileDocument.form.getFormState().values;
    for (const key of Object.keys(e.detail.value)) {
      fileDocument.form.setValuesIn(key, e.detail.value[key]);
    }

    dispatch(actionCreator.fileDocument.saveTempValue(fileDocument.form.getFormState().values))
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
