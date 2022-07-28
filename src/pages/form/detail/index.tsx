import { useRouter } from '@tarojs/taro'
import { useState } from 'react'
// import React, { useEffect, useMemo, useState } from 'react'
import { View, Form } from '@tarojs/components'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/react'
import { Switch, Input, Picker, Text, Cell, LinkCell, Button } from '@/formily-components'
import { Textarea } from '@/components'
import '@/weui/style/weui.less'
// import styles from './index.module.less'
import inputData from './schema/input.json'

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
    Button,
  }
})

const FormDetailPage = () => {
  const [pageStructure, setPageStructure] = useState(inputData);
  const { params } = useRouter();

  return (
    <View style={pageStructure.form.style} data-weui-theme="light">
      {/* <Textarea maxLength={200} showCounter /> */}

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

export default FormDetailPage;
