import Taro, { useDidHide, useDidShow, useRouter } from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
import { View, Form } from '@tarojs/components'
import { createForm, onFieldInputValueChange, onFieldValueChange } from '@formily/core'
import { FormProvider } from '@formily/react'
import styles from './index.module.less'
import { initialState } from '@/models/dictionary'
import { observable } from '@formily/reactive'
import { calcPattern, getSchemaFromPath } from '@/utils/formily'
import { scope as globalScope, useFileDocumentState } from '@/models/file-document'
import cloneDeep from 'clone-deep'
import create from 'zustand'
import { defaultPageStructure } from '@/default/page-structure'
import { SchemaContainer } from '@/containers'
import { defaultTaskDetail } from '@/default/task'
import { CommonApi } from '@/api'
import { useGlobalState } from '@/models'
import produce from 'immer'
import { delay } from '@/utils'

const scope = observable.shallow({
  $params: {},
  $dictionary: { ...initialState },
  $page: {
    taskDetail: { ...defaultTaskDetail },
    serviceDetail: {},
  },
  $shared: {
    calcPattern,
  }
});

const typeDataMap = {
  'input': require('./schema/input.json'),
  'textarea': require('./schema/input.json'),
  'radio': require('./schema/radio.json'),
}
const typeComponentMap = {
  input: 'Input',
  radio: 'Radio.Group',
  textarea: 'Textarea',
}

interface PageState {
  domain: {
    pageStructure: any;
    changedValues: any;
  },
  toolkit: {
    fetchPageStructure: (name: string) => Promise<any>;
    setPageStructure: (pageStructure: any) => void;
    setChangedValues: (payload: any) => void;
    clearChangedValues: () => void;
  }
}
const usePageState = create<PageState>((set) => ({
  domain: {
    pageStructure: cloneDeep(defaultPageStructure),
    changedValues: {},
  },
  toolkit: {
    async fetchPageStructure(name) {
      const response = await CommonApi.getPageStructure({ name });
      const pageStructure = JSON.parse(response.data.content);
      set(produce(draft => {
        draft.domain.pageStructure = pageStructure;
      }));
    },
    setPageStructure(pageStructure) {
      set(produce(draft => {
        draft.domain.pageStructure = pageStructure;
      }));
    },
    setChangedValues({ path, value }) {
      set(produce(draft => {
        draft.domain.changedValues[path] = value;
      }));
    },
    clearChangedValues() {
      set(produce(draft => {
        draft.domain.changedValues = {};
      }));
    }
  }
}))

const FormDetailPage = () => {
  const [loading, setLoading] = useState(false);
  const { state: globalState } = useGlobalState();
  const { domain: globalDomain, toolkit: globalToolkit } = useFileDocumentState();
  const { domain, toolkit } = usePageState();
  const [changedFormValues, setChangedFormValues] = useState<any>({});
  const form = useMemo(() => createForm({
    values: cloneDeep(globalDomain.formValues),
    effects() {
      onFieldInputValueChange('*', (field, form) => {
        setChangedFormValues({ [field.props.name]: field.value });
      });
    }
  }), [globalDomain.formValues]);
  const { params } = useRouter();

  const init = async () => {
    setLoading(true);
    scope.$params = params;

    form && form.clearFormGraph('*');

    await initPagestructure();
    setLoading(false);
  }

  useDidShow(() => {
    init();
  });

  useEffect(() => {
    scope.$dictionary = cloneDeep(globalScope.$dictionary);
    scope.$page.taskDetail = cloneDeep(globalScope.$page.taskDetail);
  }, [form])

  const handleCustom = async () => {
    await toolkit.fetchPageStructure(params?.name);
  };

  const handleSpecific = () => {
    const paramsType = params.type || 'input';
    const component = typeComponentMap[paramsType];

    const pathSchema = getSchemaFromPath(globalDomain.originPageStructure.schema, params.name);
    const currentSchema = cloneDeep(pathSchema);
    currentSchema['x-component'] = component;
    currentSchema['x-index'] = 0;
    currentSchema['x-component-props'] = {
      ...currentSchema['x-component-props'],
      placeholder: '请输入' + currentSchema['title'],
      isLink: false,
      cell: true,
      clickable: true,
    };
    currentSchema['title'] = '';
    currentSchema.name = params.name;
    const fullSchema = cloneDeep(typeDataMap[paramsType]);
    fullSchema.schema.properties[currentSchema.name] = { ...currentSchema };
    toolkit.setPageStructure(fullSchema);
  };

  const initPagestructure = async () => {
    if (params.type === 'custom') {
      await handleCustom();
    } else {
      await delay(100)
      handleSpecific();
    }
  }

  useDidHide(() => {
    toolkit.setPageStructure(cloneDeep(defaultPageStructure));
  });

  const onSubmit = async (e) => {
    try {
      await form.validate();
      if (!globalDomain.form) {
        Taro.showToast({ title: '表单错误 请重新进入表单' });
        Taro.navigateBack();
      }

      for (const key of Object.keys(changedFormValues)) {
        globalDomain.form?.setValuesIn(key, changedFormValues[key]);
      }

      globalToolkit.saveTempValue(form.getFormState().values);
      Taro.navigateBack();
    } catch(e) {
      if (e.length) {
        Taro.showToast({ title: e.reduce((prev, item) => prev.concat(item.messages), []).join(', '), icon: 'error' })
      }
      console.log('e: ', e);
      console.dir(e);
    }
  }

  useEffect(() => {
    scope.$page.serviceDetail = globalState.service[0] || {};
  }, [globalState.service]);

  return (
    <View className={styles.page} style={domain.pageStructure.form.style}>
      <Form onSubmit={onSubmit}>
        <FormProvider form={form}>
          <SchemaContainer schema={domain.pageStructure.schema} scope={scope} />
        </FormProvider>
      </Form>
    </View>
  )
}

export default FormDetailPage;
