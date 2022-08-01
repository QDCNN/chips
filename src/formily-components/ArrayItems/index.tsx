import { ArrayItems as ArrayItemsComponent } from '@/components'
import { connect, mapProps } from '@formily/react'

export const ArrayItems = connect(
  ArrayItemsComponent,
  mapProps(
    (props, field) => {
      // let nextValue = props?.value;
      // if (props?.min && props?.min > 0) {
      //   nextValue = new Array(1).fill(0).map((item, index) => props?.value[index] || {})
      // }
      return {
        ...props,
        // value: nextValue,
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
