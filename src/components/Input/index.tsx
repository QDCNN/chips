import React, { useState } from 'react'
import { View, Input as TaroInput, Label } from '@tarojs/components'
import { Cell } from '@/components'
import classNames from 'classnames';

export const Input = (props) => {
  const [focus, setFocus] = useState(false);
  const { style, error } = props;
  const onBlur = () => {
    setFocus(false);
    props.onBlur && props.onBlur();
  };
  const cls = classNames({
    'weui-input': true,
    'weui-input_error': error,
    classNames,
  })

  return (
    <Cell
      onClick={() => {
        setFocus(true);
      }}
      error={props.error}
      title={
        <TaroInput className={cls} {...props} focus={focus} onBlur={onBlur} />
      }
      style={style}
    />
  )
}

export default Input;
