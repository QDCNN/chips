import React, { useMemo } from 'react'
import { createSchemaField, observer } from '@formily/react';
import {
  Switch,
  Input,
  OriginPicker,
  Text,
  Cell,
  LinkCell,
  Button,
  Radio,
  // Image,
  // Textarea,
  Uploader,
  ArrayItems,
} from '@/formily-components-vant'
import { View } from '@tarojs/components';

export const SchemaContainer = (props) => {
  const { schema, scope, components } = props

  const SchemaField = useMemo(() => createSchemaField({
    components: {
      Switch,
      Cell,
      Input,
      OriginPicker,
      Text,
      View,
      BaseView: View,
      LinkCell,
      Button,
      Radio,
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
