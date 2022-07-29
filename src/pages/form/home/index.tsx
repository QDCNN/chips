import React, { useEffect, useMemo, useState } from 'react'
import { View, Form, Button } from '@tarojs/components'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField, Schema } from '@formily/react'
import { observable, autorun } from '@formily/reactive'
// import CellOrigin from '@/components/Cell'
import { Switch, Input, Picker, Text, Cell, LinkCell } from '@/formily-components'
import AnchorNavigation from '@/components/AnchorNavigation'
import Taro from '@tarojs/taro'
import * as api from '@/api/service'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { initialState } from '@/models/dictionary'
import objectPath from 'object-path'
import data from './data.json'
import '@/weui/style/weui.less'


Schema.registerCompiler((expression: any, scope?: any) => {
  const result = objectPath.get(scope, expression);
  return result;
});

const form = createForm();

const SchemaField = createSchemaField({
  components: {
    Switch,
    Cell,
    Input,
    Picker,
    Text,
    BaseView: View,
    LinkCell,
  }
})

const scope = observable({ $business: { user: { name: '', phone: '' } }, $dictionary: {...initialState} })

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


const HomePage = () => {
  const [pageStructure, setPageStructure] = useState({ schema: {}, form: {} });
  const { dictionary } = useSelector((store: RootState) => store);
  // const [pageStructure, setPageStructure] = useState(data);
  // const [scope, setScope] = useState({ $business: { name: '', phone: '' } });
  // const pageEditorComponentRefs = useRef<any>([]);
  const anchorTextList = useMemo(() => {
    const list: any[] = [];
    const { properties } = data.schema;
    for (const key in properties) {
      const componentProps = properties[key]['x-component-props'];
      const component = properties[key]['x-component'];
      if (component === 'Text' && componentProps.isAnchor && componentProps.id) {
        list.push({ title: componentProps.content, index: properties[key]['x-index'], id: componentProps.id })
      }
    }
    return list;
  }, []);

  useEffect(() => {
    scope.$dictionary = dictionary;
  }, [dictionary]);

  const onAnchorClick = async (item) => {
    const rectDom = await weappBoundingClientRect(item.id);
    Taro.pageScrollTo({ scrollTop: rectDom.top });
  };

  async function fetchPageStructure() {
    const response = await api.getPageStructure({ name: 'file-document' });
    if (response.data.content) setPageStructure(JSON.parse(response.data.content));

    form.setInitialValues({ name: '123' });
    scope.$business = { user: { name: '崔正', phone: '15824281322' } }
  }

  const onTestUpload = async () => {
    const aliossResponse = await api.getAliOSSInfo({});
    const response = await Taro.chooseImage({})
    Taro.uploadFile({
      url: aliossResponse.data.host,
      filePath: response.tempFilePaths[0],
      name: 'file',
      formData: {
        // key: 'demo.png',
        signature: aliossResponse.data.signature,
        policy: aliossResponse.data.policy,
        OSSAccessKeyId: aliossResponse.data.accessKeyId,
        'x-oss-security-token': aliossResponse.data.securityToken
      }
    })
  }

  useEffect(() => {
    fetchPageStructure()
  }, []);

  const handleSubmit = async () => {
    const formValues = await form.submit();
    console.log('formValues: ', formValues);
  }

  return (
    <View style={pageStructure.form.style} data-weui-theme="light">
      <AnchorNavigation value={anchorTextList} onClick={onAnchorClick} />

      {/* <CellOrigin dot link title="label">123</CellOrigin> */}
      {/* <Button onClick={onTestUpload}>测试上传</Button> */}
      <Form onSubmit={handleSubmit}>
        <FormProvider form={form}>
          <View>
            <SchemaField schema={pageStructure.schema} scope={scope}></SchemaField>
          </View>
        </FormProvider>

        <Button formType="submit">测试提交</Button>
      </Form>
    </View>
  )
}

export default HomePage;
