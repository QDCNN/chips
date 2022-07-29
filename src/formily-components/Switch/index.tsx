import { Switch as TaroSwitch } from '@tarojs/components'
import { connect, mapProps } from '@formily/react'

export const Switch = connect(
  TaroSwitch,
  mapProps(
    // {
    //   value: 'checked',
    // },
    (props) => {
      const onChange = props.onChange
      const checked = props.value;
      delete props['value']
      return {
        ...props,
        checked,
        onChange(checked) {
          onChange?.(checked, null)
        },
      }
    }
  )
)

export default Switch
