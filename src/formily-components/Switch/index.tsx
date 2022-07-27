import { Switch as TaroSwitch } from '@tarojs/components'
import { connect, mapProps } from '@formily/react'

export const Switch = connect(
  TaroSwitch,
  mapProps(
    {
      value: 'checked',
    },
    (props) => {
      const onChange = props.onChange
      delete props['value']
      return {
        ...props,
        onChange(checked) {
          onChange?.(checked, null)
        },
      }
    }
  )
)

export default Switch
