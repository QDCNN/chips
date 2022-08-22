import { CellGroup as VantCellGroup } from '@antmjs/vantui'
import { connect, mapProps } from '@formily/react'
import { Cell as CellComponent } from '@/components'

export const Cell = connect(
  CellComponent,
  mapProps({
    title: 'title',
    description: 'label',
  }, (props, field) => {
    return {
      size: 'large',
      className: 'van-ellipsis',
    };
  })
)

export const CellGroup = VantCellGroup;
