import { View, Form } from '@tarojs/components'
import styles from './index.module.less'
import { Routes } from '@/routes'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { useEffect, useMemo } from 'react'
import { FormProvider } from '@formily/react'
import { SchemaContainer } from '@/containers'
import { observable } from '@formily/reactive'
import { createForm } from '@formily/core'
import pageStructure from './schema/data.json'
import create from 'zustand'
import { YinghuoApi } from '@/api'
import produce from 'immer'

interface PageState {
  state: {
    goodsDetail: { goods_sku: {} },
  },
  actions: {
    fetchGoodsDetail: (id: string) => Promise<any>
  }
}

const usePageState = create<PageState>((set) => ({
  state: {
    goodsDetail: { goods_sku: {} }
  },
  actions: {
    async fetchGoodsDetail(goods_id) {
      const response = await YinghuoApi.getGoodsDetail({ goods_id });
      set(produce(draft => {
        draft.state.goodsDetail = response.data.detail;
      }));
    }
  },
}))

const GoodsDetail = () => {
  const scope = useMemo(() => observable({ $page: { goodsDetail: { goods_sku: {} } } }), []);
  const form = useMemo(() => createForm(), []);
  const { params } = useRouter();
  const { state, actions } = usePageState();

  useDidShow(() => {
    actions.fetchGoodsDetail(params.id);
  });

  useEffect(() => {
    scope.$page.goodsDetail = state.goodsDetail;
  }, [state.goodsDetail]);

  return (
    <View className={styles.page} style={pageStructure.form.style}>
      <Form>
        <FormProvider form={form}>
          <SchemaContainer schema={pageStructure.schema} scope={scope} />
        </FormProvider>
      </Form>
    </View>
  )
}

export default GoodsDetail;
