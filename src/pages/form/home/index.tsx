import React, { useMemo, useState } from 'react'
import { View, Form } from '@tarojs/components'
import { FormProvider, createSchemaField, Schema } from '@formily/react'
// import { $ } from '@tarojs/extend'
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
import Taro, { useDidHide, useDidShow, usePageScroll, useRouter } from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import { actionCreator, RootState } from '@/store'
import { simpleCompiler } from '@/utils/formily'
import { formDictionaryQueue } from '@/queue'
import { scope } from '@/models/file-document'
import { weappBoundingClientRect } from '@/utils/dom'
import cloneDeep from 'clone-deep'
import { defaultPageStructure } from '@/default/page-structure'

Schema.registerCompiler(simpleCompiler);

const SchemaField = createSchemaField({
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
    Button,
  }
})

const FormHomePage = () => {
  const [scrollTop, setScrollTop] = useState();
  const { fileDocument } = useSelector((store: RootState) => store);
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
    Taro.pageScrollTo({ scrollTop: scrollTop + rectDom.top });
  };

  usePageScroll((pageRect) => {
    setScrollTop(pageRect.scrollTop);
  });

  useDidShow(async () => {
    if (params.id != fileDocument.taskId) {
      fileDocument.form.clearFormGraph('*');
    }

    await formDictionaryQueue.onEmpty();

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

  const handleSubmit = async () => {
    try {
      const formValues = await fileDocument.form.submit();
      dispatch(actionCreator.fileDocument.submitFormValues({ task_id: params.id, content: JSON.stringify(formValues) }));
      Taro.navigateBack();
    } catch(validationErrors) {
      const queryResult = fileDocument.form.query(validationErrors[0].address);
      Taro.showToast({
        icon: 'none',
        title: `${queryResult.get('title')}: ${validationErrors[0].messages}`
      });
    }
  }

  useDidHide(() => {
    dispatch(actionCreator.fileDocument.setPageStructure(cloneDeep(defaultPageStructure)));
  });

  return (
    <View style={fileDocument.pageStructure.form.style} data-weui-theme="light">
      <AnchorNavigation value={anchorTextList} onClick={onAnchorClick} />

      <Form onSubmit={handleSubmit}>
        <FormProvider form={fileDocument.form}>
          <View>
            <SchemaField schema={fileDocument.pageStructure.schema} scope={scope}></SchemaField>
          </View>
        </FormProvider>

        {fileDocument.pageStructure.schema.properties  && <Button formType="submit" type="default">提交</Button>}
      </Form>
    </View>
  )
}

export default FormHomePage;
