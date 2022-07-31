

import React from 'react'
import { connect, mapReadPretty, mapProps, ReactFC } from '@formily/react'
// import { Select as AntdSelect } from 'antd'
import { Picker as TaroPicker } from '@/components'
import { getFullName } from '@/utils/formily'


export const Picker: React.FC<any> = connect(
  TaroPicker,
  mapProps(
    (props, field) => {
      let options = !field?.dataSource ? [] : field?.dataSource;
      // const handleChange = (e) => {
      //   console.log('handleChange: ', e, props, field);
      //   const currentValue = e.detail.value;
      //   let nextValue = currentValue;
      //   if (props.mode === 'selector' && options[currentValue]) {
      //     nextValue = options[currentValue].value;
      //   }

      //   // props.onChange && props.onChange(nextValue);
      // }
      // delete props['value']

      return {
        ...props,
        title: field?.title || props.label,
        isLink: true,
        dot: field?.required && !Boolean(field?.value),
        options: options,
        name: getFullName(field),
        // onChange(e) {
        //   handleChange?.(e)
        // },
        // suffixIcon:
        //   field?.['loading'] || field?.['validating'] ? (
        //     'loading'
        //   ) : (
        //     props.suffixIcon
        //   ),
      }
    }
  ),
  // mapReadPretty(PreviewPicker)
)

export default Picker
