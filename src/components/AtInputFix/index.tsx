import React, { useState } from 'react';
import AtCell from '../AtCell';
import { Block, Button, Image, Input as TaroInput, View } from '@tarojs/components';
import { usePrefixCls } from '@/__builtins__';
import cls from 'classnames'


const ATInputFix = (props) => {

  const {
    isLink, className, inForm, inline, hover, extHoverClass,
    iconClass, icon, title, value, children,
    footerClass, showError, error, style, dot, content, clear,
    onChange, placeholder, ...resetProps

  } = props;
  const prefixCls = usePrefixCls('cell', props);

  const [isBlur, setIsBlur] = useState(false)
  const onBlur = () => {
    setIsBlur(false)
  }
  const onFocus = () => {
    setIsBlur(true)
  }
  const onClear = () => {
    props.onChange('')
  }

  return (
    <Block>
      <View
        className={cls(prefixCls, {
          [prefixCls + '_access']: isLink,
          [prefixCls + '-inform']: inForm,
          [prefixCls + '_label-block']: inline,
        }, className)}
        hoverClass={cls({ [prefixCls + '_active']: hover }, extHoverClass)}
        style={style}
        {...resetProps}
      >
        <View className={cls([prefixCls + '__hd'], iconClass)}>

          {title && (
            <Block>
              <View className={cls({ 'weui-label': inForm })}>{title}</View>
            </Block>
          )}

          {dot && (
            <View className={`${prefixCls}__dot-box`}>
              <View className={`${prefixCls}__dot`}></View>
            </View>
          )}
        </View>
        <View className={cls(prefixCls + '__bd', 'weui-flex')}>
          <TaroInput
            value={value}
            // placeholder={placeholder}
            {...props}
            onBlur={onBlur}
            onFocus={onFocus}
            onInput={(e) => {
              onChange(e.detail.value)
              // console.log(e.detail.value);
            }}

          ></TaroInput>
          {clear && (
            <Image src={icon} onClick={onClear} className={cls(prefixCls + '__icon')} mode="aspectFit" style={{ width: '18px', height: '18px', display: isBlur ? '' : 'none' }} />
          )}
        </View>
        {/* )} */}
        {children && (
          <View className={cls(prefixCls + '__ft', prefixCls + '__ft_in-access', footerClass)}>
            {children ? children : value && value}
          </View>
        )}
        {/* {value && (
          <View className={cls(prefixCls + '__ft', prefixCls + '__ft_in-access', footerClass)}>
            {children ? children : value && value}
          </View>
        )} */}
      </View>
      {error && (
        <View className="weui-cells__tips weui-cells__tips_warn">{error}</View>
      )}

    </Block>


  )




}


export default ATInputFix;
