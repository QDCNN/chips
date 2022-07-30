import { Cell as CellComponent } from '@/components'
import { connect, mapProps } from '@formily/react'
import Taro from '@tarojs/taro'
import { combineQuery } from '@/utils/route'
import { Routes } from '@/routes'

export const LinkCell = connect(
  CellComponent,
  mapProps(
    (props, field) => {
      const { dataSource = [] } = field;
      const title = field?.title || props.title;

      const match = dataSource.find(item => item.value === props.value);

      return {
        ...props,
        dot: field?.props?.required && !Boolean(field?.value),
        title: field?.title || props.title,
        children: field?.description,
        value: props.type === 'input' ? props.value : match?.label,
        onClick: () => {
          Taro.navigateTo({ url: combineQuery(Routes.FormDetailPage, { title, name: field.props.name, type: props.type }) })
        }
      }
    }
  )
)

export default LinkCell
