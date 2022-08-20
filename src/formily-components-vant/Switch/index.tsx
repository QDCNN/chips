// import { Switch as TaroSwitch } from '@tarojs/components'
import { Switch as VantSwitch } from '@antmjs/vantui'
import { connect, mapProps } from '@formily/react'

export const Switch = connect(
  VantSwitch,
  mapProps(
    {
      value: 'checked',
    },
    (props) => {
      const onChange = props.onChange
      delete props['value']
      return {
        activeValue: 1,
        inactiveValue: 0,
        onChange(e) {
          onChange?.(e.detail);
        },
      }
    }
  )
)

export default Switch
