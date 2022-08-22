import React, { memo, useEffect, useMemo, useState } from 'react'
import { View, Form } from '@tarojs/components'
import { FormProvider } from '@formily/react'
import AnchorNavigation from '@/components/AnchorNavigation'
import Taro, { useDidShow, usePageScroll, useRouter } from '@tarojs/taro'
import { formDictionaryQueue } from '@/queue'
import { scope as globalScope, useFileDocumentState } from '@/models/file-document'
import { weappBoundingClientRect } from '@/utils/dom'
import cloneDeep from 'clone-deep'
import { SchemaContainer } from '@/containers'
import { createForm, onFieldInputValueChange, onFormInit } from '@formily/core'

const FormHomeInnerPage = memo((props) => {
  const { form } = props;
  const { domain, toolkit } = useFileDocumentState();

  const { params } = useRouter();

  const handleSubmit = async () => {
    try {
      const formValues = await form.submit();
      toolkit.submitFormValues({ task_id: params.id, content: JSON.stringify(formValues) });
      Taro.navigateBack();
    } catch (validationErrors) {
      const queryResult = form.query(validationErrors[0].address);
      Taro.showToast({
        icon: 'none',
        title: `${queryResult.get('title')}: ${validationErrors[0].messages}`
      });
    }
  }

  return (
    <View style={domain.pageStructure.form.style}>
      <Form onSubmit={handleSubmit}>
        <FormProvider form={form}>
          <SchemaContainer schema={domain.pageStructure.schema} scope={globalScope} />
        </FormProvider>
      </Form>
    </View>
  )
})

const filterAnchorTextList = (properties, list = [] as any[]) => {
    for (const key in properties) {
      const componentProps = properties[key]['x-component-props'];
      const component = properties[key]['x-component'];
      if (component === 'Text' && componentProps.isAnchor && componentProps.id) {
        list.push({ title: componentProps.content, index: properties[key]['x-index'], id: componentProps.id })
      }
      if (component.properties) filterAnchorTextList(component.properties, list);
    }
    return list;
}

const FormHomePage = () => {
  const { domain, toolkit } = useFileDocumentState();
  const [scrollTop, setScrollTop] = useState(0);
  const [anchorTextList, setAnchorTextList] = useState<any[]>([]);
  const { params } = useRouter();
  const form = useMemo(() => createForm({
    initialValues: cloneDeep(domain.formValues),
    effects() {
      onFieldInputValueChange('*', (field, $form) => {
        toolkit.saveTempValue($form.getFormState().values);
      });
    }
  }), [domain.formValues]);

  usePageScroll((pageRect) => {
    setScrollTop(pageRect.scrollTop);
  });

  const init = async () => {
    await formDictionaryQueue.onEmpty();

    fetchTaskDetail();
    fetchPageSturture();
  }

  useDidShow(() => {
    init();
  });

  const fetchPageSturture = async () => {
    const pageStructure = await toolkit.fetchPageStructure();
    setAnchorTextList(filterAnchorTextList(pageStructure.schema.properties, []));
  }

  const fetchTaskDetail = async () => {
    if (params.id == domain.taskId) return;

    toolkit.fetchTaskDetail({ task_id: params.id });
    toolkit.fetchLatestTask({ task_id: params.id });
  }

  const onAnchorClick = async (item) => {
    const rectDom = await weappBoundingClientRect(item.id);
    Taro.pageScrollTo({ scrollTop: scrollTop + rectDom.top });
  };

  return (
    <View>
      <AnchorNavigation scrollTop={scrollTop} value={anchorTextList} onClick={onAnchorClick} />

      <FormHomeInnerPage form={form} />
    </View>
  )
}

export default FormHomePage;
