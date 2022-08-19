import { connect, mapProps } from '@formily/react'
import { Field } from '@antmjs/vantui'

export const Input = connect(
  Field,
  mapProps({
    title: 'label',
  }, (props, field) => {
    const { onChange } = props;
    delete props.onChange;
    return ({
      onChange: (e) => {
        onChange(e.detail)
      }
    })
  })
  // mapReadPretty(WeInput)
)

export default Input
