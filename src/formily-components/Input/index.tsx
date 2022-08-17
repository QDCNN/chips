import React, { createContext, useContext } from 'react'
import { connect, mapProps, mapReadPretty } from '@formily/react'
import { isArr, toArr, isValid } from '@formily/shared'
import { View } from '@tarojs/components'
import { Input as InputComponent } from '@/components'
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
  InputComponent,
  // Base,
  mapProps({
    onInput: 'onChange',
  },
  (props, field) => {
    const onChange = props.onChange
    const error = field.selfErrors.length ? field.selfErrors[0] : '';
    // console.log('props: any, field: ', props, field);
    // delete props.onChange;
    return {
      onInput: (e) => {
        console.log('e.detail.value: ', e.detail.value);
        if (onChange) {
          onChange(e.detail.value);
        }
      },
      name: field?.props?.name,
      type: props?.inputType || props?.type,
      error
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
  // mapReadPretty(WeInput)
)

// Input.TextArea = connect(AntdInput.TextArea, mapReadPretty(PreviewText.Input))

export default Input
