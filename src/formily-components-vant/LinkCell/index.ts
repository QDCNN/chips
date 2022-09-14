import { Routes } from '@/routes';
import { combineQuery } from '@/utils/route';
// import { Cell } from '@antmjs/vantui'
import { connect, mapProps } from '@formily/react';
import Taro from '@tarojs/taro';
import { Cell } from '@/components';

export const LinkCell = connect(
  Cell,
  mapProps(
    {
      title: 'title',
      description: 'label',
    },
    (props, field) => {
      const { dataSource = [] } = field;
      const finalProps = {
        value: props.content || props.value,
        size: 'large',
        className: 'van-ellipsis',
        onClick: () => {
          if (props?.disabled) return;
          const params: { type: string, name: string } = {
            type: props.type,
            name: field.path.entire as string,
          }

          if (props.type == 'form-custom') {
            params.name = props.pageName;
            Taro.navigateTo({ url: combineQuery(Routes.FormPage, params) });
            return;
          }
          if (props.type == 'custom') {
            params.name = props.pageName;
          }
          Taro.navigateTo({ url: combineQuery(Routes.FormDetailPage, params) });
        }
      }

      if (!['input', 'custom'].includes(props.type)) {
        const match = dataSource.filter(item => item).find(item => item.value === props.value);
        finalProps.value = match?.label;
      }

      return finalProps;
    }
  )
)

export default LinkCell
