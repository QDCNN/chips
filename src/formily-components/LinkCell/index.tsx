import { Cell as CellComponent } from '@/components'
import { connect, mapProps } from '@formily/react'
import Taro from '@tarojs/taro'
import { combineQuery } from '@/utils/route'
import { Routes } from '@/routes'
import { getFullName } from '@/utils/formily'

export const LinkCell = connect(
  CellComponent,
  mapProps(
    (props, field) => {
      const { dataSource = [] } = field;
      const title = field?.title || props.title;

      const match = dataSource.filter(item => item).find(item => item.value === props.value);

      // console.log('LinkCell props, field: ', props, field)

      return {
        ...props,
        dot: field?.props?.required && !Boolean(field?.value),
        title: field?.title || props.title,
        children: field?.description,
        value: props.type === 'input' ? props.value : match?.label,
        onClick: () => {
          if (props.disabled) return;
          Taro.navigateTo({ url: combineQuery(Routes.FormDetailPage, { title, name: getFullName(field), type: props.type }) })
        }
      }
    }
  )
)

export default LinkCell
