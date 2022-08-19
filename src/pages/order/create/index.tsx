import { SchemaContainer } from '@/containers'
import { defaultPageStructure } from '@/default/page-structure'
import { createForm, onFormSubmit } from '@formily/core'
import { FormProvider } from '@formily/react'
import { observable } from '@formily/reactive'
import { Form, View } from '@tarojs/components'
import React, { useEffect, useMemo } from 'react'
import create from 'zustand'
import cloneDeep from 'clone-deep'
import { CommonApi, YinghuoApi } from '@/api'
import { ORDER_CREATE_TEMPLATE_KEY } from '@/constants/form'
import produce from 'immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import styles from './index.module.less'
import { useGlobalState } from '@/models'
import { combineQuery } from '@/utils/route'
import { Routes } from '@/routes'
import { handlePay } from '@/utils/order'
import { defaultOrderPayParams } from '@/default/order'

interface PageState {
  state: {
    pageStructure: any,
    goodsDetail: any,
  },
  actions: {
    fetchPageStructure: () => Promise<any>,
    fetchGoodsDetail: (goodId: string) => Promise<any>,
    buy: (params: any) => Promise<any>,
  }
}

const usePageState = create<PageState>((set, get) => ({
  state: {
    goodsDetail: {},
    pageStructure: cloneDeep(defaultPageStructure),
  },
  actions: {
    async fetchPageStructure() {
      const response = await CommonApi.getPageStructure({ name: ORDER_CREATE_TEMPLATE_KEY })
      set(produce(draft => {
        draft.state.pageStructure = JSON.parse(response.data.content)
      }));
    },
    async fetchGoodsDetail(goods_id) {
      const response = await YinghuoApi.getGoodsDetail({ goods_id })
      set(produce(draft => {
        draft.state.goodsDetail = response.data.detail
      }))
      return response.data.detail
    },
    async buy(params) {
      const { data } = await YinghuoApi.buyNow({ ...defaultOrderPayParams, ...params });
      handlePay(data);
    }
  }
}));

const OrderCreatePage = () => {
  const { params } = useRouter();
  const scope = useMemo(() => observable({
    $page: { serviceDetail: {}, goodsDetail: { goods_sku: {} } },
    $toolkit: { chooseAddress: null }
  }), []);
  const form = useMemo(() => createForm(), []);
  const { state, actions } = usePageState();
  const { state: globalState } = useGlobalState();

  const handleInit = async () => {
    actions.fetchPageStructure();
    const goodsDetail = await actions.fetchGoodsDetail(params.goods_id);
    scope.$page.goodsDetail = goodsDetail;
  };

  useDidShow(() => {
    handleInit();
  });

  useEffect(() => {
    scope.$page.serviceDetail = globalState.service[0] || {};
  }, [globalState.service]);

  const handleSubmit = async () => {
    await form.validate();
    actions.buy({ ...form.getFormState().values, goods_id: params.goods_id });
  };

  const chooseAddress = async ($form) => {
    const response = await Taro.chooseAddress();
    if (response.errMsg !== 'chooseAddress:ok') return;
    $form.values.address = `${response.userName} ${response.telNumber} ${response.cityName} ${response.countyName} ${response.detailInfo}`;
  }

  useEffect(() => {
    scope.$toolkit.chooseAddress = chooseAddress;
  }, [chooseAddress])

  return (
    <View className={styles.page} style={state.pageStructure.form.style}>
      <Form onSubmit={handleSubmit}>
        <FormProvider form={form}>
          <SchemaContainer schema={state.pageStructure.schema} scope={scope} />
        </FormProvider>
      </Form>
    </View>
  )
}

export default OrderCreatePage
