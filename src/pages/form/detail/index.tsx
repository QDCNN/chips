import Taro, { useDidHide, useDidShow, useRouter } from '@tarojs/taro'
import { useEffect, useMemo } from 'react'
import { View, Form } from '@tarojs/components'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField, observer } from '@formily/react'
import { Switch, Input, Picker, Text, Cell, LinkCell, Button, Radio, Image, Textarea } from '@/formily-components'
import styles from './index.module.less'
import { actionCreator, RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { initialState } from '@/models/dictionary'
import { observable } from '@formily/reactive'
import { getSchemaFromPath } from '@/utils/formily'
import { scope as globalScope, useFileDocumentState } from '@/models/file-document'
import cloneDeep from 'clone-deep'
import create from 'zustand'
import * as api from '@/api'
import { defaultPageStructure } from '@/default/page-structure'
import { SchemaContainer } from '@/containers'

const scope = observable({
  $params: {},
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
  'input': require('./schema/input.json'),
  'textarea': require('./schema/input.json'),
  'radio': require('./schema/radio.json'),
}
const typeComponentMap = {
  input: 'Input',
  radio: 'Radio',
  textarea: 'Textarea',
}

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
      const response = await api.getPageStructure({ name });
      const pageStructure = JSON.parse(response.data.content);
      set({ domain: { pageStructure } });
    },
    setPageStructure(pageStructure) {
      set({ domain: { pageStructure } });
    }
  }
}))

const FormDetailPage = () => {
  const { domain: globalDomain, toolkit: globalToolkit } = useFileDocumentState();
  const { domain, toolkit } = usePageState();
  const form = useMemo(() => createForm({ initialValues: globalDomain.formValues }), [globalDomain.formValues]);
  const { params } = useRouter();

  useDidShow(() => {
    scope.$params = params;

    initPagestructure();
  });

  useEffect(() => {
    form.setValues(cloneDeep(globalDomain.formValues));
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
    currentSchema.name = params.name;
    const fullSchema = cloneDeep(typeDataMap[paramsType]);
    fullSchema.schema.properties[currentSchema.name] = { ...currentSchema };
    toolkit.setPageStructure(fullSchema);
    console.log('fullSchema: ', fullSchema);
  };

  const initPagestructure = () => {
    if (params.type === 'custom') {
      handleCustom();
    } else {
      setTimeout(() => {
        handleSpecific();
      }, 100);
    }
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
    scope.$task = cloneDeep(globalScope.$task);
  }, [domain.pageStructure]);

  return (
    <View className={styles.page} style={domain.pageStructure.form.style} data-weui-theme="light">
      <Form onSubmit={onSubmit}>
        <FormProvider form={form}>
          <SchemaContainer schema={domain.pageStructure.schema} scope={scope} />
        </FormProvider>
      </Form>
    </View>
  )
}

export default FormDetailPage;
