import Taro, { useDidHide, useDidShow, useRouter } from '@tarojs/taro'
import { useEffect, useMemo } from 'react'
import { View, Form } from '@tarojs/components'
import { createForm } from '@formily/core'
import { FormProvider } from '@formily/react'
import { initialState } from '@/models/dictionary'
import { observable } from '@formily/reactive'
import { scope as globalScope, useFileDocumentState } from '@/models/file-document'
import cloneDeep from 'clone-deep'
import create from 'zustand'
import { defaultPageStructure } from '@/default/page-structure'
import { SchemaContainer } from '@/containers'
import { defaultTaskDetail } from '@/default/task'
import { CommonApi } from '@/api'
import { useGlobalState } from '@/models'
import { calcPattern } from '@/utils/formily'

const scope = observable.shallow({
  $params: {},
  $dictionary: { ...initialState },
  $page: {
    taskDetail: { ...defaultTaskDetail },
    serviceDetail: {},
  },
  $shared: {
    calcPattern
  }
});
interface PageState {
  domain: {
    pageStructure: any;
  },
  toolkit: {
    fetchPageStructure: (name: string) => Promise<any>;
    setPageStructure: (pageStructure: any) => void;
  }
}
const usePageState = create<PageState>((set) => ({
  domain: {
    pageStructure: cloneDeep(defaultPageStructure),
  },
  toolkit: {
    async fetchPageStructure(name) {
      const response = await CommonApi.getPageStructure({ name });
      const pageStructure = JSON.parse(response.data.content);
      set({ domain: { pageStructure } });
    },
    setPageStructure(pageStructure) {
      set({ domain: { pageStructure } });
    }
  }
}))

const DemoPage = () => {
  const { state: globalState } = useGlobalState();
  const { domain: globalDomain, toolkit: globalToolkit } = useFileDocumentState();
  const { domain, toolkit } = usePageState();
  const form = useMemo(() => createForm({ initialValues: globalDomain.formValues }), [globalDomain.formValues]);
  const { params } = useRouter();

  useDidShow(async () => {
    scope.$params = params;

    initPagestructure();
  });

  useEffect(() => {
    form.setValues(cloneDeep(globalDomain.formValues));
  }, [form])

  const initPagestructure = () => {
    toolkit.fetchPageStructure('kokoro-demo');
  }

  useDidHide(() => {
    toolkit.setPageStructure(cloneDeep(defaultPageStructure));
  });

  const onSubmit = async (e) => {
    await form.validate();
    for (const key of Object.keys(e.detail.value)) {
      form.setValuesIn(key, e.detail.value[key]);
    }

    globalToolkit.saveTempValue(form.getFormState().values);
    Taro.navigateBack();
  }

  useEffect(() => {
    scope.$dictionary = cloneDeep(globalScope.$dictionary);
    scope.$page.taskDetail = cloneDeep(globalScope.$page.taskDetail);
  }, [domain.pageStructure]);

  useEffect(() => {
    scope.$page.serviceDetail = globalState.service[0] || {};
  }, [globalState.service]);

  return (
    <View style={domain.pageStructure.form.style}>
      <Form onSubmit={onSubmit}>
        <FormProvider form={form}>
          <SchemaContainer schema={domain.pageStructure.schema} scope={scope} />
        </FormProvider>
      </Form>
    </View>
  )
}

export default DemoPage;
