

import React from 'react'
import { connect, mapReadPretty, mapProps, ReactFC } from '@formily/react'
// import { Select as AntdSelect } from 'antd'
import { Picker as TaroPicker } from '@/components'

export const Picker: React.FC<any> = connect(
  TaroPicker,
  mapProps(
    (props, field) => {
      return {
        ...props,
        title: field.title || props.label,
        isLink: true,
        dot: field?.required && !Boolean(field?.value),
        options: field?.dataSource,
        // suffixIcon:
        //   field?.['loading'] || field?.['validating'] ? (
        //     'loading'
        //   ) : (
        //     props.suffixIcon
        //   ),
      }
    }
  ),
  // mapReadPretty(PreviewPicker)
)

export default Picker
