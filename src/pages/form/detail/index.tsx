import { useRouter } from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
// import React, { useEffect, useMemo, useState } from 'react'
import { View, Form, Label } from '@tarojs/components'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/react'
import { Switch, Input, Picker, Text, Cell, LinkCell, Button, Radio } from '@/formily-components'
// import { Textarea } from '@/components'
import '@/weui/style/weui.less'
// import styles from './index.module.less'
import inputData from './schema/input.json'
import radioData from './schema/radio.json'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
// import { DictionaryProperty } from '@/models/dictionary'
// import * as lodash from 'lodash'

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
    Radio,
  }
});

// const titleDictionaryMap = {
//   '落户方式': DictionaryProperty.落户方式
// }

const typeDataMap = {
  'input': inputData,
  'radio': inputData
}

const FormDetailPage = () => {
  const { dictionary } = useSelector((store: RootState) => store);
  const [pageStructure, setPageStructure] = useState(inputData);
  const { params } = useRouter();

  useEffect(() => {
    setPageStructure(typeDataMap[params.type])
  }, [params]);

  // const currentDictionary = useMemo(() => lodash.get(dictionary, titleDictionaryMap[decodeURIComponent(params.title)], []), [dictionary, params.title])

  // console.log('currentDictionary: ', currentDictionary);

  return (
    <View style={pageStructure.form.style} data-weui-theme="light">
      {/* <Radio options={[{ label: '1', value: '1' }, { label: '1', value: '1' }]} /> */}
      {/* <Textarea maxLength={200} showCounter /> */}

      <Form>
        <FormProvider form={form}>
          <View>
            <SchemaField schema={pageStructure.schema} scope={{ $dictionary: dictionary }}></SchemaField>
          </View>
        </FormProvider>
      </Form>
    </View>
  )
}

export default FormDetailPage;
