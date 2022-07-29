import { Image as ImageComponent } from '@/components'
import { connect, mapProps } from '@formily/react'

export const Image = connect(
  ImageComponent,
  mapProps(
    (props, field) => {
      console.log('props, field: ', props, field);
      return {
        ...props,
        // title: field?.title || props.title,
        // children: props?.children || field?.description,
      }
    }
  )
)

export default Image
