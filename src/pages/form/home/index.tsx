import React, { useEffect, useMemo, useState } from 'react'
import { View, Form, Button } from '@tarojs/components'
import { createForm } from '@formily/core'
import { FormProvider, Field, createSchemaField } from '@formily/react'
import Cell from '@/components/Cell'
import CellOrigin from '@/components/Cell/origin'
import { Switch, Input, Picker, Text } from '@/formily-components'
import '@/weui/style/weui.less'
import './index.scss'
import data from './data.json'
import AnchorNavigation from '@/components/AnchorNavigation'
import Taro from '@tarojs/taro'
import * as api from '@/api/service'

const form = createForm();

const SchemaField = createSchemaField({
  components: {
    Switch,
    Cell,
    Input,
    Picker,
    Text,
    BaseView: View
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


const HomePage = () => {
  const [pageStructure, setPageStructure] = useState({ schema: {}, form: {} });
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

  const onAnchorClick = async (item) => {
    const rectDom = await weappBoundingClientRect(item.id);
    Taro.pageScrollTo({ scrollTop: rectDom.top });
  };

  async function fetchPageStructure() {
    const response = await api.getPageStructure({ name: 'file-document' });
    if (response.data.content) setPageStructure(JSON.parse(response.data.content));

    form.setInitialValues({ name: '123' });
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
    // Taro.showNavigationBarLoading();
  }, []);

  return (
    <View style={pageStructure.form.style}>
      <AnchorNavigation value={anchorTextList} onClick={onAnchorClick} />

      <CellOrigin dot link title="label">123</CellOrigin>
      {/* <Button onClick={onTestUpload}>测试上传</Button> */}
      <Form>
        <FormProvider form={form}>
          <View>
            <SchemaField schema={pageStructure.schema}></SchemaField>
          </View>
        </FormProvider>
      </Form>
    </View>
  )
}

export default HomePage;
