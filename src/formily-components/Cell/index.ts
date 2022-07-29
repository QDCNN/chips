import { Cell as CellComponent } from '@/components'
import { connect, mapProps } from '@formily/react'

export const Cell = connect(
  CellComponent,
  mapProps(
    (props, field) => {
      return {
        ...props,
        title: field?.title || props.title,
        children: props?.children || field?.description,
      }
    }
  )
)

export default Cell
