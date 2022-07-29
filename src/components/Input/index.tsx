import React, { useState } from 'react'
import { View, Input as TaroInput, Label } from '@tarojs/components'
import { Cell } from '@/components'

export const Input = (props) => {
  const [focus, setFocus] = useState(false);
  const { style } = props;
  const onBlur = () => setFocus(false);

  return (
    <Cell
      onClick={() => {
        console.log('onClick');
        setFocus(true);
      }}
      title={
        <TaroInput {...props} focus={focus} onBlur={onBlur} />
      }
      style={style}
    />
  )
}

export default Input;
