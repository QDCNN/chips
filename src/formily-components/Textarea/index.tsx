import { Textarea as TaroTextarea } from '@/components'
import { connect, mapProps } from '@formily/react'

export const Textarea = connect(
  TaroTextarea,
  mapProps(
    (props, field) => {
      return {
        name: field.props.name
      };
    }
    // (props) => {
    //   const onChange = props.onChange
    //   delete props['value']
    //   return {
    //     ...props,
    //     onChange(checked) {
    //       onChange?.(checked, null)
    //     },
    //   }
    // }
  )
)

export default Textarea
