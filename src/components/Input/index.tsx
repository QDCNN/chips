import React from 'react'
import { View, Input as TaroInput, Label } from '@tarojs/components'
import { Cell } from '@/components'

export const Input = (props) => {
  const { style } = props;
  console.log('props.name: ', props.name);
  return (
    <Label for={props.name}>
      <Cell
        title={
          <TaroInput id={props.name} {...props} />
        }
        style={style}
      />
    </Label>
  )
}

export default Input;
