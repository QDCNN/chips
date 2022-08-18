import { Uploader as VantUploader} from '@antmjs/vantui'
import { connect, mapProps } from '@formily/react'

export const Uploader = connect(
  VantUploader,
  mapProps(
    {
      title: 'uploadText',
    }
    // (props, field: any) => {
    //   return {
    //     title: field?.title || props.title,
    //     description: field?.description || props.description,
    //   }
    // }
  )
)

export default Uploader
