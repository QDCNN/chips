import React, { useMemo } from 'react'
import { Picker as TaroPicker, View } from '@tarojs/components'
import { Cell } from '@/components'

export const Picker = (props) => {
  const { options = [], onChange, value, mode, ...other } = props;
  const range = useMemo(() => options.map(item => item.label), []);
  const handleChange = (e) => {
    const currentValue = e.detail.value;
    let nextValue = currentValue;
    if (mode === 'selector' && options[currentValue]) {
      nextValue = options[currentValue].value;
    }

    onChange && onChange(nextValue);
  }

  const showText = useMemo(() => {
    console.log('showText: ', mode, value, options);
    if (mode === 'selector') {
      const match = options.find(item => item.value === value);
      return match && match.label;
    }
    return value;
  }, [mode, value, options])

  return (
    <TaroPicker mode={mode} range={range} onChange={handleChange} {...other}>
      <Cell {...other} title={other.title}>{showText}</Cell>
    </TaroPicker>
  )
}

export default Picker;
