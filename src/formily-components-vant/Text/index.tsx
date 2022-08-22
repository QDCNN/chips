import React from 'react'
import { DnFC } from '@designable/react'
import { Text as TaroText } from '@tarojs/components'
import cls from 'classnames'

export interface IDesignableTextProps {
  value?: string
  content?: string
  style?: React.CSSProperties
  className?: string
}

export const Text: DnFC<IDesignableTextProps> = (props) => {
  return React.createElement(
    TaroText,
    {
      ...props,
      className: cls(props.className, 'dn-text'),
      'data-content-editable': 'x-component-props.content',
    },
    props.content
  )
}