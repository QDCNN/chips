import { ArrayItems as ArrayItemsComponent } from '@/components'
import { connect, mapProps } from '@formily/react'

export const ArrayItems = connect(
  ArrayItemsComponent,
  mapProps(
    (props, field) => {
      return {
        ...props,
        // children: props?.children || field?.title || props.title,
        // formType: props.functional === 'copy' ? null : 'submit',
        // onClick: () => {
        //   if (props.functional === 'copy') {
        //     Taro.setClipboardData({ data: props.value });
        //   }
        // }
      }
    }
  )
)

export default ArrayItems
