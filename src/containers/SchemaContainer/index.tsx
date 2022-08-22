import React, { useMemo } from 'react'
import { createSchemaField, observer } from '@formily/react';
import {
  Switch,
  Input,
  OriginPicker,
  Text,
  Cell,
  CellGroup,
  LinkCell,
  Button,
  Radio,
  // Image,
  // Textarea,
  Uploader,
  ArrayItems,
} from '@/formily-components-vant'
import { View, Image } from '@tarojs/components';

export const SchemaContainer = (props) => {
  const { schema, scope, components } = props

  const SchemaField = useMemo(() => createSchemaField({
    components: {
      Switch,
      Cell,
      CellGroup,
      Input,
      OriginPicker,
      Text,
      View,
      Image,
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
    <SchemaField schema={schema} scope={scope} />
  )
}
