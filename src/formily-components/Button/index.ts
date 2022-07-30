import { Button as ButtonComponent } from '@/components'
import { connect, mapProps } from '@formily/react'
import Taro from '@tarojs/taro'

export const Button = connect(
  ButtonComponent,
  mapProps(
    (props, field) => {
      return {
        ...props,
        children: props?.children || field?.title || props.title,
        formType: props.functional === 'copy' ? null : 'submit',
        onClick: () => {
          if (props.functional === 'copy') {
            Taro.setClipboardData({ data: props.value });
          }
        }
      }
    }
  )
)

export default Button
