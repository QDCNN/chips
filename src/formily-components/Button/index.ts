import { Button as ButtonComponent } from '@/components'
import { connect, mapProps } from '@formily/react'

export const Button = connect(
  ButtonComponent,
  mapProps(
    (props, field) => {
      return {
        ...props,
        children: props?.children || field?.title || props.title,
      }
    }
  )
)

export default Button
