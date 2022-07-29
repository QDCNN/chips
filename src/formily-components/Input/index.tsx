import React, { createContext, useContext } from 'react'
import { connect, mapProps, mapReadPretty } from '@formily/react'
import { isArr, toArr, isValid } from '@formily/shared'
import { View } from '@tarojs/components'
import { Input as WeInput } from '@/components'
import cls from 'classnames'
import Base from '../Base'
// import { Input as AntdInput } from 'antd'
// import { InputProps, TextAreaProps } from 'antd/lib/input'
// import { PreviewText } from '../preview-text'
// import { LoadingOutlined } from '@ant-design/icons'

// type ComposedInput = React.FC<React.PropsWithChildren<InputProps>> & {
//   TextArea?: React.FC<React.PropsWithChildren<TextAreaProps>>
// }

// const PlaceholderContext = createContext<React.ReactNode>('N/A')

// const usePlaceholder = (value?: any) => {
//   const placeholder = useContext(PlaceholderContext) || 'N/A'
//   return isValid(value) && value !== '' ? value : placeholder
// }

// const CustomInput = (props) => {
//   return (
//     <View className={cls(props.className)} style={props.style} onClick={onClick}>
//       {props.addonBefore}
//       {props.prefix}
//       {usePlaceholder(props.value)}
//       {props.suffix}
//       {props.addonAfter}
//     </View>
//   )
// }

export const Input = connect(
  WeInput,
  // Base,
  mapProps((props: any, field) => {
    return {
      ...props,
      onInput: (e) => {
        props.onChange(e.detail.value);
      },
      name: field?.props?.name
      // suffix: (
      //   <View>
      //     {field?.['loading'] || field?.['validating'] ? (
      //       'loading'
      //     ) : (
      //       props.suffix
      //     )}
      //   </View>
      // ),
    }
  }),
  mapReadPretty(WeInput)
)

// Input.TextArea = connect(AntdInput.TextArea, mapReadPretty(PreviewText.Input))

export default Input
