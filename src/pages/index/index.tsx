import { Form, View } from '@tarojs/components'
import styles from './index.module.less'
import { useEffect, useMemo } from 'react'
import { useGlobalState } from '@/models'
import { observable } from '@formily/reactive'
import { FormProvider } from '@formily/react'
import { SchemaContainer } from '@/containers'
import pageStructure from './schema/data.json'
import { createForm } from '@formily/core'


const HomePage = () => {
  const scope = useMemo(() => observable({ $page: { serviceDetail: {}, goodsList: [] } }), []);
  const form = useMemo(() => createForm(), []);
  const { state } = useGlobalState();

  useEffect(() => {
    scope.$page.serviceDetail = state.service[0] || {};
  }, [state.service]);
  useEffect(() => {
    scope.$page.goodsList = state.goodsList;
  }, [state.goodsList]);

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

export default HomePage;
