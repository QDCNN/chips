import { Cell as CellComponent } from '@/components'
import { connect, mapProps } from '@formily/react'

export const Cell = connect(
  CellComponent,
  mapProps(
    (props, field) => {
      return {
        dot: typeof props.dot === 'boolean' ? props.dot : !Boolean(field?.value),
        ...props,
        title: field?.title || props.title,
      }
    }
  )
)

export default Cell
