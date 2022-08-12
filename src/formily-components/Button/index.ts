import { Button as ButtonComponent } from '@/components'
import { connect, mapProps } from '@formily/react'
import Taro from '@tarojs/taro'

export const Button = connect(
  ButtonComponent,
  mapProps(
    (props, field) => {
      const { onClick } = props;
      delete props.onClick;
      return {
        ...props,
        children: props?.children || field?.title || props.title,
        // formType: props.functional === 'copy' ? null : props.formType,
        onClick: () => {
          console.log('onClick: ', props);
          if (props.functional === 'copy') {
            Taro.setClipboardData({ data: props.value });
            Taro.showToast({ title: '复制成功', icon: 'none' });
            console.log('previewImage: ')
          }
          if (props.functional === 'previewImage') {
            console.log('previewImage: ')
            Taro.previewImage({ urls: [props.value], current: props.value, showmenu: true });
          }
          if (props.functional === 'openDocument') {
            Taro.downloadFile({
              url: props.value
            }).then(downloadResponse => {
              Taro.openDocument({
                filePath: downloadResponse.tempFilePath,
              });
            });
          }
          if (props.functional === 'shareFile') {
            Taro.downloadFile({
              url: props.value
            }).then(downloadResponse => {
              Taro.shareFileMessage({
                filePath: downloadResponse.tempFilePath,
              });
            });
          }
          onClick?.();
        }
      }
    }
  )
)

export default Button
