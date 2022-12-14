import { connect, mapProps } from '@formily/react'
import { Field } from '@antmjs/vantui'

export const Input = connect(
  Field,
  mapProps({
    title: 'label',
    onInput: 'onChange',
  }, (props, field) => {
    const onInput = props.onInput;
    return ({
      name: field.props.name,
      onInput: (e) => {
        onInput?.(e.detail);
      }
    })
  })
)

export default Input
