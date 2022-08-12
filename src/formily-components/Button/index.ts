import { Button as ButtonComponent } from '@/components'
import { connect, mapProps } from '@formily/react'
import Taro from '@tarojs/taro'

export const Button = connect(
  ButtonComponent,
  mapProps(
    (props, field) => {
      const { onClick } = props;
      console.log('onClick: ', onClick);
      delete props.onClick;
      return {
        ...props,
        children: props?.children || field?.title || props.title,
        formType: props.functional === 'copy' ? null : props.formType,
        onClick: () => {
          console.log('mapProps: onClick');
          if (props.functional === 'copy') {
            Taro.setClipboardData({ data: props.value });
          }
          onClick?.();
        }
      }
    }
  )
)

export default Button
