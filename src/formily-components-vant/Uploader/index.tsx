import { Uploader as VantUploader} from '@antmjs/vantui'
import { connect, mapProps } from '@formily/react'

export const Uploader = connect(
  VantUploader,
  mapProps(
    {
      title: 'uploadText',
    },
    (props, field: any) => {
      return {
        afterRead: async (file) => {
          console.log('file: ', file);
        }
      }
    }
  )
)

export default Uploader
