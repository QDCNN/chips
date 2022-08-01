import React, { useEffect, useMemo, useState } from 'react'
import { Picker as TaroPicker, View } from '@tarojs/components'
import { Cell } from '@/components'

enum Mode {
  单向选择 = 'selector',
  多项选择 = 'multiSelector',
}

export const Picker = (props, ref) => {
  const { options = [], value, mode, onChange, ...other } = props;
  const [tempValue, setTempValue] = useState([0, 0]);

  const range = useMemo(() => {
    if (mode == Mode.多项选择) {
      const currentTempValue = tempValue.length > 0 ? tempValue : [0, 0];
      const multiOptions: string[][] = [];
      let highrUpOptions: string[] = options;

      for (const item of currentTempValue) {
        // console.log('multiOptions: ', multiOptions, item);
        multiOptions.push(highrUpOptions.map(option => option.label));
        if (highrUpOptions[item]) highrUpOptions = highrUpOptions[item].children;
      }

      return multiOptions;
    }

    if (mode == Mode.单向选择) {
      return (options.map(item => item.label));
    }
    return (options);
  }, [options, mode, value, tempValue]);

  const handleChange = (e) => {
    const currentValue = e.detail.value;
    let nextValue = currentValue;
    if (mode === Mode.单向选择 && options[currentValue]) {
      nextValue = options[currentValue].value;
    }

    if (mode === Mode.多项选择) {
      let highrUpOptions = options;
      const list = [];
      for (const item of currentValue) {
        const matchOption = highrUpOptions[item];
        if (matchOption) list.push(matchOption.value);
        if (matchOption.children) highrUpOptions = matchOption.children;
      }
      nextValue = list;
    }

    onChange?.(nextValue);
  }

  const handleColumnChange = (e) => {
    const nextTempValue = [...tempValue];
    nextTempValue[e.detail.column] = e.detail.value;
    setTempValue(nextTempValue);
  }

  const showText = useMemo(() => {
    if (mode === Mode.单向选择) {
      const match = options.find(item => item.value === value);
      return match && match.label;
    }
    if (mode === Mode.多项选择) {
      const list = [];
      let highrUpOptions = options;
      for (const item of value) {
        const matchOption = highrUpOptions.find(option => option.value == item);
        if (!matchOption) break;
        if (matchOption) list.push(matchOption.label);
        if (matchOption.children) highrUpOptions = matchOption.children;
      }
      return list.join(',');
    }

    return value;
  }, [mode, value, options]);

  const pickerValue = useMemo(() => {
    if (mode === Mode.单向选择) {
      const index = options.findIndex(item => item.value === value);
      return index;
    }
    if (mode === Mode.多项选择) {
      if (tempValue) return tempValue;
      const list: number[] = [];
      let highrUpOptions = options;
      for (const item of value) {
        const matchOption = highrUpOptions.findIndex(option => option.value == item);
        if (matchOption < 0) break;
        list.push(matchOption);
        if (matchOption.children) highrUpOptions = matchOption.children;
      }
      return list;
    }
    return value;
  }, [mode, value, tempValue, options])

  return (
    <TaroPicker mode={mode} range={range} value={pickerValue} {...other} onChange={handleChange} onColumnChange={handleColumnChange}>
      <Cell className={props.className} style={props.style} {...other} title={other.title} value={showText}>{showText}</Cell>
    </TaroPicker>
  )
}

export default Picker;
