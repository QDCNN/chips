import { Routes } from '@/routes';
import { combineQuery } from '@/utils/route';
import { Button as VantButton } from '@antmjs/vantui'
import { connect, mapProps } from '@formily/react'
import Taro from '@tarojs/taro';

export const Button = connect(
  VantButton,
  mapProps({
    title: 'children',
  },
    (props, field) => {
      const { onClick } = props;
      delete props.onClick;
      return {
        children: props?.children || field?.title || props.title,
        onClick: () => {
          if (props.disabled) return;
          if (props.functional === 'copy') {
            Taro.setClipboardData({ data: props.data });
            Taro.showToast({ title: '复制成功', icon: 'none' });
          }
          if (props.functional === 'previewImage') {
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
