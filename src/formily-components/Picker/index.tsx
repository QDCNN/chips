

import React from 'react'
import { connect, mapReadPretty, mapProps, ReactFC } from '@formily/react'
// import { Select as AntdSelect } from 'antd'
import { Picker as TaroPicker, View } from '@tarojs/components'
import { Cell } from '@/components'
// import { SelectProps } from 'antd/lib/select'
// import { PreviewText } from '../preview-text'
// import { LoadingOutlined } from '@ant-design/icons'

const CustomPicker = (props) => {
  return (
    <TaroPicker mode={props.mode} range={props.range}>
      <Cell {...props} />
    </TaroPicker>
  )
}

// const PreviewPicker = (props) => {
//   return <Cell {...props} />
// }

export const Picker: React.FC<any> = connect(
  CustomPicker,
  mapProps(
    {
      dataSource: 'range',
      loading: true,
    },
    (props, field) => {
      return {
        ...props,
        title: field.title || props.label,
        dot: typeof props.dot === 'boolean' ? props.dot : !Boolean(field?.value),
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
