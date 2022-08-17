import React, { useMemo } from 'react'
import { createSchemaField, observer } from '@formily/react';
import {
  Switch,
  Input,
  Picker,
  Text,
  Cell,
  LinkCell,
  Button,
  Radio,
  Image,
  Textarea,
  Uploader,
  ArrayItems,
} from '@/formily-components'
import { View } from '@tarojs/components';

export const SchemaContainer = (props) => {
  const { schema, scope, components } = props

  const SchemaField = useMemo(() => createSchemaField({
    components: {
      Switch,
      Cell,
      Input,
      Textarea,
      Picker,
      Text,
      BaseView: View,
      LinkCell,
      Button,
      Radio,
      Image,
      ArrayItems,
      Uploader,
      ...components,
    },
  }), [components])

  return (
    <View data-weui-theme="light">
      <SchemaField schema={schema} scope={scope} />
    </View>
  )
}
