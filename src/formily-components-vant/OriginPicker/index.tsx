

import React from 'react'
import { connect, mapProps } from '@formily/react'
import { OriginPicker as OriginPickerComponent } from '@/components'


export const OriginPicker: React.FC<any> = connect(
  OriginPickerComponent,
  mapProps(
    {
      dataSource: 'options',
      description: 'label',
      title: 'title',
    },
    () => ({
      className: 'van-ellipsis'
    })
  ),
)
