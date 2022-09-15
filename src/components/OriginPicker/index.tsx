import { useMemo, useState } from 'react'
import { Picker as TaroPicker } from '@tarojs/components'
import { Cell } from '@antmjs/vantui'

enum Mode {
  单向选择 = 'selector',
  多项选择 = 'multiSelector',
  省市区 = 'region',
}

export const OriginPicker = (props, ref) => {
  const { options = [], value, mode, onChange, ...other } = props;
  const [tempValue, setTempValue] = useState([0, 0]);
  const style: any = props.style || {};
  if (props.disabled) {
    style.color = '#c8c9cc';
  };

  const range = useMemo(() => {
    if (mode == Mode.多项选择) {
      const currentTempValue = tempValue.length > 0 ? tempValue : [0, 0];
      const multiOptions: string[][] = [];
      let highrUpOptions: string[] = options;

      for (const item of currentTempValue) {
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

    if (mode === Mode.省市区) {
      nextValue = e.detail.code;
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
    const showTextValue = value || [];
    if (mode === Mode.多项选择) {
      const list = [];
      let highrUpOptions = options || [];
      for (const item of showTextValue) {
        const matchOption = highrUpOptions.find(option => option.value == item);
        if (!matchOption) break;
        if (matchOption) list.push(matchOption.label);
        if (matchOption.children) highrUpOptions = matchOption.children;
      }
      return list.join(',');
    }

    if (mode === Mode.省市区) {
      const list = [];
      let highrUpOptions = options || [];
      for (const item of showTextValue) {
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
    <TaroPicker mode={mode} range={range} value={pickerValue} onChange={handleChange} onColumnChange={handleColumnChange} {...other}>
      <Cell style={style} isLink size='large' value={showText} {...other}>{showText}</Cell>
    </TaroPicker>
  )
}

