import { Button as ButtonComponent } from '@/components'
import { Routes } from '@/routes';
import { combineQuery } from '@/utils/route';
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
          if (props.disabled) return;
          if (props.functional === 'copy') {
            Taro.setClipboardData({ data: props.data });
            Taro.showToast({ title: '复制成功', icon: 'none' });
          }
          if (props.functional === 'previewImage') {
            console.log('previewImage: ', props)
            Taro.previewImage({ urls: [props.data], current: props.data, showmenu: true });
          }
          if (props.functional === 'openDocument') {
            Taro.downloadFile({
              url: props.data
            }).then(downloadResponse => {
              Taro.openDocument({
                filePath: downloadResponse.tempFilePath,
              });
            });
          }
          if (props.functional === 'shareFile') {
            Taro.downloadFile({
              url: props.data
            }).then(downloadResponse => {
              Taro.shareFileMessage({
                filePath: downloadResponse.tempFilePath,
              });
            });
          }
          if (props.functional === 'custom-page') {
            const params: any = {
              type: 'custom',
              name: props.pageName,
            }

            Taro.navigateTo({ url: combineQuery(Routes.FormDetailPage, params) });
          }
          onClick?.();
        }
      }
    }
  )
)

export default Button
