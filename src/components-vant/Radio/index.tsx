 /* eslint-disable */
import { Radio as VantRadio, RadioGroup as VantRadioGroup } from '@antmjs/vantui'
import { RadioGroupProps } from '@antmjs/vantui/types/radio'
import React, { useMemo } from 'react'
import { Cell } from '@antmjs/vantui'

type ComposedRadio = React.FC<React.PropsWithChildren<any>> & {
  Group?: React.FC<React.PropsWithChildren<RadioGroupProps & { options?: any[], cell?: boolean, name?: string }>>
}

export const Radio: ComposedRadio = (props: any) => {
  const { label, value, ...other } = props;
  return <VantRadio name={value} {...other}>{label}</VantRadio>
}

const CellRadio = (props) => {
  const { label, value, name } = props;

  return <Cell title={label} clickable renderRightIcon={<Radio name={name} />} />
}

Radio.Group = (props) => {
  const { children, cell, name, onChange, onClick, options, ...other } = props;
  const childrenRender = useMemo(() => {
    const ContainerComponent = cell ? CellRadio : Radio;
    if (options) return (
      <>
        {options.map(item => (
          <ContainerComponent name={item.value} key={item.value} label={item.label} value={item.value} {...other} />
        ))}
      </>
    )
    return children;
  }, [options, cell]);

  return (
    <VantRadioGroup onChange={onChange} {...other}>
      {childrenRender}
    </VantRadioGroup>
  )
}
