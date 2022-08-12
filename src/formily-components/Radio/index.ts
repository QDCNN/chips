import { Radio as RadioComponent } from '../../components'
import { View } from '@tarojs/components'
import { connect, mapProps, mapReadPretty } from '@formily/react'

export const Radio = connect(
  RadioComponent,
  mapProps(
    (props, field: any) => {
      return {
        ...props,
        options: field?.dataSource || [],
        name: field?.props?.name,
      }
    }
  ),
  mapReadPretty(View, {
    children: '单选框组',
  })
)

export default Radio
