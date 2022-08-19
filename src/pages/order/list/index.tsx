import { Form, View } from '@tarojs/components'
import { useEffect, useMemo } from 'react'
import { observable } from '@formily/reactive'
import { FormProvider } from '@formily/react'
import { SchemaContainer } from '@/containers'
import pageStructure from './schema/data.json'
import { createForm } from '@formily/core'
import styles from './index.module.less'
import { createDrawer } from '@/hooks/create-drawer'
import { formParamsPipeline, yinghuoResponsePipeline } from '@/transformers'
import { YinghuoApi } from '@/api'
import { useDidShow } from '@tarojs/taro'
import create from 'zustand'
import dayjs from 'dayjs'
import { handlePay } from '@/utils/order'
dayjs.extend(require('dayjs/plugin/duration'));

const useDrawer = createDrawer(yinghuoResponsePipeline(formParamsPipeline(YinghuoApi.getOrderList)));

const calcDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
  const startT = dayjs(startTime);
  const endT = dayjs(endTime);
  const diff = endT.diff(startT); // 时间差
  const diffHours = dayjs.duration(diff).hours();
  const diffMinutes = dayjs.duration(diff).minutes();
  const diffSeconds = dayjs.duration(diff).seconds();

  return `${diffHours !== 0 ? `${diffHours}:` : ''}${diffMinutes < 10 ? `0${diffMinutes}` : diffMinutes}:${diffSeconds < 10 ? `0${diffSeconds}` : diffSeconds}`;
}

const usePageState = create((set) => ({
  actions: {
    orderPay: async (record) => {
      const { data } = await YinghuoApi.orderPay({ order_id: record.order_id });
      handlePay(data);
    }
  }
}))

const OrderListPage = () => {
  const { actions } = usePageState();
  const { drawer, toolkit } = useDrawer();
  const scope = useMemo(() => observable({ $page: { orderList: [] }, $toolkit: { calcDuration } }), []);
  const form = useMemo(() => createForm(), []);

  useDidShow(() => {
    toolkit.search({ dataType: 'all' });

    setInterval(() => {
      scope.$page.currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
  });

  useEffect(() => {
    scope.$page.orderList = drawer.list;
  }, [drawer.list]);

  useEffect(() => {
    scope.$toolkit.orderPay = actions.orderPay;
  }, [actions]);


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

export default OrderListPage;
