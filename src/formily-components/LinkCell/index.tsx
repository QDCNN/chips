import { Cell as CellComponent } from '@/components'
import { connect, mapProps } from '@formily/react'
import Taro from '@tarojs/taro'
import { combineQuery } from '@/utils/route'
import { Routes } from '@/routes'

export const LinkCell = connect(
  CellComponent,
  mapProps(
    (props, field) => {
      const title = field?.title || props.title;

      return {
        ...props,
        dot: field.required && !Boolean(field?.value),
        children: field?.description,
        title: field?.title || props.title,
        onClick: () => {
          Taro.navigateTo({ url: combineQuery(Routes.FormDetailPage, { title, name: field.props.name, type: props.type }) })
        }
      }
    }
  )
)

export default LinkCell
