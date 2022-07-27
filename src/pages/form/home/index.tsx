import React, { useEffect, useMemo } from 'react'
import { View, Form } from '@tarojs/components'
import { createForm } from '@formily/core'
import { FormProvider, Field, createSchemaField } from '@formily/react'
import Cell from '@/components/Cell'
import { Switch, Input, Picker, Text } from '@/formily-components'
import '@/weui/style/weui.less'
import './index.scss'
import data from './data.json'
import AnchorNavigation from '@/components/AnchorNavigation'
import Taro from '@tarojs/taro'
import * as api from '@/api'
// import Taro from '@tarojs/taro'

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
    const response = await api.getPageStructure({});
    console.log('response: ', response);
  }

  useEffect(() => {
    fetchPageStructure()
    // Taro.showNavigationBarLoading();
  }, []);

  return (
    <View style={{ backgroundColor: 'rgba(246,246,246,1)' }}>
      <AnchorNavigation value={anchorTextList} onClick={onAnchorClick} />
      <Form>
        <FormProvider form={form}>
          <View>
            <SchemaField schema={data.schema}></SchemaField>
          </View>
        </FormProvider>
      </Form>
    </View>
  )
}

export default HomePage;
