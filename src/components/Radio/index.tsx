import { RadioGroup, Label, Radio as TaroRadio, View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import cls from 'classnames';
import React from 'react';

const WebLabel = (props) => {
  const { ...other } = props;
  delete other.for;
  return (
    <label htmlFor={other.for} {...other}>{other.children}</label>
  )
}

const UsedLabel = Taro.getEnv() === Taro.ENV_TYPE.WEB ? WebLabel : Label

export const Radio = (props) => {
  const {
    className, children,
    vcode, warn,
    select, selectPos, value, options = [],
    onChange, ...others
  } = props;

  const classNameList = cls({
    'weui-check': true,
    [className]: className
  });
  const radioClassNameList = cls({
    'weui-cell': true,
    'weui-check__label': true,
    'weui-cell_vcode': vcode,
    'weui-cell_warn': warn,
    'weui-cell_switch': props.switch,
    'weui-cell_select': select,
    'weui-cell_select-before': selectPos === 'before',
    'weui-cell_select-after': selectPos === 'after',
    [className]: className
  });

  return (
    <View clasName="weui-cells__group weui-cells__group_form">
      <RadioGroup className="weui-cells weui-cells_radio" onChange={onChange}>
        {options.map((item, index) => (
          <UsedLabel className={radioClassNameList} key={index} for={index} {...others}>
            <View className="weui-cell__bd">
              <Text>{item.label}</Text>
            </View>
            {/* <View className="weui-cell__ft"> */}
              <TaroRadio className="weui-cell__ft" value={item.value} checked={item.value === value} />
            {/* </View> */}
          </UsedLabel>
        ))}
      </RadioGroup>
    </View>
  )
}

export default Radio;
