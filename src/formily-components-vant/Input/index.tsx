import { connect, mapProps } from '@formily/react'
import { Field } from '@antmjs/vantui'

export const Input = connect(
  Field,
  mapProps({
    title: 'label',
  })
  // mapReadPretty(WeInput)
)

export default Input
