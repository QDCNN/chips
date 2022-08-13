import Taro, { useDidHide, useDidShow, useRouter } from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
// import React, { useEffect, useMemo, useState } from 'react'
import { View, Form } from '@tarojs/components'
import { createForm, onFormSubmit } from '@formily/core'
import { FormProvider, createSchemaField, Schema, observer } from '@formily/react'
import { Switch, Input, Picker, Text, Cell, LinkCell, Button, Radio, Image, Textarea } from '@/formily-components'
import '@/weui/style/weui.less'
import styles from './index.module.less'
import inputData from './schema/input.json'
import radioData from './schema/radio.json'
import { actionCreator, RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { initialState } from '@/models/dictionary'
import { observable } from '@formily/reactive'
import merge from 'merge'
import { getSchemaFromPath, simpleCompiler } from '@/utils/formily'
import { scope as globalScope } from '@/models/file-document'
// import { useDuraArray } from '@/hooks/use-dura'
// import { fileDocumentDetailObserve } from '@/models/file-document-detail'
// import objectPath from 'object-path'

Schema.registerCompiler(simpleCompiler);

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
}

const typeComponentMap = {
  input: 'Input',
  radio: 'Radio',
  textarea: 'Textarea',
}
const FormDetailPage = () => {
  const { fileDocument, fileDocumentDetail } = useSelector((store: RootState) => store);
  const [pageStructure, setPageStructure] = useState({ form: {}, schema: {} });
  const form = useMemo(() => createForm(), []);
  const dispatch = useDispatch();
  const { params } = useRouter();

  useDidShow(() => {
    setPageStructure({ form: {}, schema: {} });

    setTimeout(() => {
      // initPageData();
      initPagestructure();
    }, 1000);
  });

  const handleCustom = async () => {
    dispatch(actionCreator.fileDocumentDetail.fetchPageStructure(params.name));
  };

  const handleSpecific = () => {
    const paramsType = params.type || 'input';
    const component = typeComponentMap[paramsType];

    const pathSchema = getSchemaFromPath(fileDocument.originPageStructure.schema, params.name);
    const currentSchema = merge.recursive({}, pathSchema, {
      'x-component': component,
      'x-index': 0,
      name: params.name,
    });
    const fullSchema = merge.recursive({}, typeDataMap[paramsType]);
    fullSchema.schema.properties[currentSchema.name] = { ...currentSchema };
    setPageStructure(fullSchema);

    const fullForm = fileDocument.form.getFormState();
    scope.$fullForm.values = fullForm.values;
    form.setValues(fullForm.values);
  };

  // const initPageData = () => {
  // };

  const initPagestructure = () => {
    if (params.type === 'custom') {
      handleCustom();
    } else {
      handleSpecific();
    }
  }

  useDidHide(() => {
    form.clearFormGraph('*');
    setPageStructure({ form: {}, schema: {} });
    // dispatch(actionCreator.fileDocumentDetail.setPageStructure({ form: {}, schema: {} }));
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

  useEffect(() => {
    const fullForm = fileDocument.form.getFormState();
    form.setValues(fullForm.values);
    scope.$dictionary = merge.recursive({}, globalScope.$dictionary);
    scope.$task = merge.recursive({}, globalScope.$task);
    scope.$fullForm.values = merge.recursive({}, fullForm.values);
    scope.$params = params;

    setPageStructure({ ...fileDocumentDetail.pageStructure });
  }, [fileDocumentDetail.pageStructure]);

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
