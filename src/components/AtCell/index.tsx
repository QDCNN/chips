import { usePrefixCls } from '@/__builtins__';
import { Block, Icon, Image, View } from '@tarojs/components';
import cls from 'classnames';
import React from 'react';

export const AtCell = (props) => {
  const {
    isLink, className, inForm, inline, hover, extHoverClass,
    iconClass, icon, title, value, children,
    footerClass, showError, error, style, dot, content,
    ...resetProps
  } = props;
  const prefixCls = usePrefixCls('cell', props);
  // console.log('props: ', error);

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
          {icon && (
            <Block>
              <Image src={icon} className={cls(prefixCls + '__icon')} mode="aspectFit" />
            </Block>
          )}

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
        {content && (
          <View className={cls(prefixCls + '__bd')}>
            {content}
          </View>
        )}
        {children && (
          <View className={cls(prefixCls + '__ft', prefixCls + '__ft_in-access', footerClass)}>
            {children ? children : value && value}
          </View>
        )}
        {value && (
          <View className={cls(prefixCls + '__ft', prefixCls + '__ft_in-access', footerClass)}>
            {children ? children : value && value}
          </View>
        )}
      </View>
      {error && (
        <View className="weui-cells__tips weui-cells__tips_warn">{error}</View>
      )}
    </Block>
  )
}

export default AtCell;
