import React from 'react'
import { View, Input as TaroInput } from '@tarojs/components'
import { Cell } from '@/components'

export const Input = (props) => {
  const { style } = props;
  return (
    <Cell
      title={
        <TaroInput {...props} />
      }
      style={style}
    />
  )
}

export default Input;
