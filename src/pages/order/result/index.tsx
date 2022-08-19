import { Button } from '@antmjs/vantui';
import { Icon, View, Text } from '@tarojs/components';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import styles from './index.module.less';
import create from 'zustand';
import { YinghuoApi } from '@/api';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { Routes } from '@/routes';
import produce from 'immer';

interface PageState {
  state: {
    status: 'wait' | 'finished'
  },
  actions: {
    fetchOrderDetail: (params: any) => Promise<void>
    handleCycleFetch: (params: any) => any
  }
}

const usePageState = create<PageState>((set, get) => ({
  state: {
    status: 'wait',
  },
  actions: {
    fetchOrderDetail: async (params) => {
      const response = await YinghuoApi.getOrderDetail({ order_id: params.id });
      const { order } = response.data;
      if (order.pay_status.value === 10) {
        Taro.showToast({
          title: '未成功支付，请重试',
          icon: 'error',
          duration: 3000
        })
        Taro.reLaunch({ url: Routes.OrderList })
      }
      if (order.pay_status.value === 20) {
        set(produce(draft => {
          draft.state.status = 'finished';
        }));
      }
    },
    handleCycleFetch: async (params) => {
      const timer = setInterval(() => {
        const { state, actions } = get();
        if (state.status === 'finished') {
          clearInterval(timer);
          Taro.hideLoading();
          return;
        }
        actions.fetchOrderDetail(params);
      }, 2000);

      return () => clearInterval(timer);
    }
  }
}))

const OrderResultPage = () => {
  const { params } = useRouter();
  const { state, actions } = usePageState();

  useDidShow(() => {
    Taro.showLoading({ title: '加载中' });
  });


  useEffect(() => {
    return actions.handleCycleFetch(params);
  }, []);

  if (state.status === 'finished') return (
    <View className={styles.page}>
      <View className={styles.flex}>
        <Icon className={styles.mb32} size="60" type="success" />
        <View className={styles.mb32}>
          <Text className={styles.title}>支付成功</Text>
        </View>
        <View className={classNames(styles.mb32, styles.descriptionBox)}>
          <Text className={styles.description}>已为您分配审核老师，可前往「材料详情」联系审核老师，请尽快提交您的申请资料。</Text>
        </View>
        <Button type="primary">去上传材料</Button>
      </View>
    </View>
  );

  return (
    <View className={styles.flex}>
      <Icon className={styles.mb32} size="60" type="waiting" />
      <View className={styles.mb32}>
        <Text className={styles.title}>正在检查支付结果</Text>
      </View>
      <View>
        <Text className={styles.description}>请稍等</Text>
      </View>
    </View>
  )
}

export default OrderResultPage;
