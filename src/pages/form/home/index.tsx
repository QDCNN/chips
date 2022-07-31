import React, { useEffect, useMemo, useState } from 'react'
import { View, Form, Picker as TaroPicker } from '@tarojs/components'
// import { createForm, onFieldChange } from '@formily/core'
import { FormProvider, createSchemaField, Schema } from '@formily/react'
// import CellOrigin from '@/components/Cell'
import {
  Switch,
  Input,
  Picker,
  Text,
  Cell,
  LinkCell,
  Uploader,
  Button,
  ArrayItems,
} from '@/formily-components'
import AnchorNavigation from '@/components/AnchorNavigation'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import { actionCreator, RootState } from '@/store'
import objectPath from 'object-path'
import data from './data.json'
import '@/weui/style/weui.less'
import { simpleCompiler } from '@/utils/formily'
import { formDictionaryQueue } from '@/queue'
import { scope } from '@/models/file-document'


Schema.registerCompiler(simpleCompiler);


const SchemaField = createSchemaField({
  scope,
  components: {
    Switch,
    Cell,
    Input,
    Picker,
    Text,
    BaseView: View,
    LinkCell,
    Uploader,
    ArrayItems,
  }
})


const weappBoundingClientRect = (id) => {
  return new Promise((resolve, reject) => {
    Taro.createSelectorQuery()
      .select('#' + id)
      .boundingClientRect((doms: any) => {
        if (!doms) reject();
        resolve({ ...doms, isOver: doms.top + doms.height < 0, fixed: doms.top <= 0 });
      })
      .exec();
  }) as Promise<any>;
};


const FormHomePage = () => {
  const { fileDocument } = useSelector((store: RootState) => store);
  // const [pageStructure, setPageStructure] = useState({ form: {}, schema: {} });
  const dispatch = useDispatch();
  const { params } = useRouter();
  const anchorTextList = useMemo(() => {
    const list: any[] = [];
    const { properties = {} } = fileDocument.pageStructure.schema;
    for (const key in properties) {
      const componentProps = properties[key]['x-component-props'];
      const component = properties[key]['x-component'];
      if (component === 'Text' && componentProps.isAnchor && componentProps.id) {
        list.push({ title: componentProps.content, index: properties[key]['x-index'], id: componentProps.id })
      }
    }
    return list;
  }, [fileDocument.pageStructure.schema]);

  const onAnchorClick = async (item) => {
    const rectDom = await weappBoundingClientRect(item.id);
    Taro.pageScrollTo({ scrollTop: rectDom.top });
  };

  useDidShow(async () => {
    await formDictionaryQueue.onEmpty();
    // console.log('dictionaryQueue.onEmpty()');
    // fileDocument.form.clearFormGraph('*');

    fetchTaskDetail();
    fetchPageSturture();
  });

  const fetchPageSturture = async () => {
    dispatch(actionCreator.fileDocument.fetchPageStructure());
  }

  const fetchTaskDetail = async () => {
    if (params.id == fileDocument.taskId) return;

    dispatch(actionCreator.fileDocument.fetchTaskDetail({ task_id: params.id }));
    dispatch(actionCreator.fileDocument.fetchLatestTask({ task_id: params.id }));
  }

  // useEffect(() => {
  //   console.log('params.id: ', params.id);
  // }, [params.id]);

  // useEffect(() => {
  //   setPageStructure(fileDocument.pageStructure);
  // }, [fileDocument.pageStructure]);

  const handleSubmit = async () => {
    try {
      const formValues = await fileDocument.form.submit();
      dispatch(actionCreator.fileDocument.submitFormValues({ task_id: params.id, content: JSON.stringify(formValues) }));
      Taro.navigateBack();
    } catch(validationErrors) {
      const queryResult = fileDocument.form.query(validationErrors[0].address);
      // console.log('queryResult: ', );
      Taro.showToast({
        icon: 'none',
        title: `${queryResult.get('title')}: ${validationErrors[0].messages}`
      });
    }
  }

  return (
    // <View style={fileDocument.pageStructure.form.style} data-weui-theme="light">
    <View style={data.form.style} data-weui-theme="light">
      <AnchorNavigation value={anchorTextList} onClick={onAnchorClick} />
      {/* <Uploader value={[]} /> */}
      {/* <Input /> */}

      <Form onSubmit={handleSubmit}>
        <FormProvider form={fileDocument.form}>
          <View>
            <SchemaField schema={fileDocument.pageStructure.schema}></SchemaField>
            {/* <SchemaField schema={data.schema}></SchemaField> */}
          </View>
        </FormProvider>

        {fileDocument.pageStructure.schema.properties  && <Button formType="submit" type="default">提交</Button>}
      </Form>
    </View>
  )
}

export default FormHomePage;
