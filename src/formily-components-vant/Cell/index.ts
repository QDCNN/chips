import { Cell as VantCell, CellGroup as VantCellGroup } from '@antmjs/vantui'
import { connect, mapProps } from '@formily/react'

export const Cell = connect(
  VantCell,
  mapProps({
    title: 'title',
    description: 'label',
  }, (props: any, field) => {
    return {
      size: 'large',
      className: 'van-ellipsis',
      children: props.value || props.children,
      required: (field.props as any).required,
    };
  })
)

export const CellGroup = VantCellGroup;
