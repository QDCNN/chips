import { usePrefixCls } from '@/__builtins__';
import { Block, Icon, Image, Text, View } from '@tarojs/components';
import cls from 'classnames';
import React from 'react';

export const AtListItem = (props) => {
  const {
    isLink, className, inForm, inline, hover, extHoverClass,
    iconClass, icon, title, value, children, avatar,
    footerClass, showError, error, style, dot, content,
    desc,
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
          {avatar && (
            <Block>
              <Image src={avatar} className={cls(prefixCls + '__icon')} mode="aspectFit" style={{ width: '96rpx', height: '96rpx', marginRight: '8rpx', color: 'var(--weui-FG-2)' }} />
            </Block>
          )}
          {icon && (
            <Block>
              <Image src={icon} className={cls(prefixCls + '__icon')} mode="aspectFit" style={{ width: '48rpx', height: '48rpx', marginRight: '8px' }} />
            </Block>
          )}

          {title && (
            <Block>
              <View className={cls({ 'weui-label': inForm })}>
                <Text>
                  {title}
                </Text>
                {desc && (
                  <View className={cls(prefixCls + '__desc')}>
                    {desc}
                  </View>
                )}
              </View>
            </Block>
          )}

          {dot && (
            <View className={`${prefixCls}__dot-box`}>
              <View className={`${prefixCls}__dot`}></View>
            </View>
          )}
        </View>

        <View className={cls(prefixCls + '__bd')}>
          {content}
        </View>

        <View className={cls(prefixCls + '__ft', prefixCls + '__ft_in-access', footerClass)}>
          {children ? children : value && value}
          {/* {showError && error && <Icon type="warn" size="23" color="#E64340" />} */}
        </View>
      </View>
      {/* <View className="weui-cells__tips weui-cells__tips_warn">{error}</View> */}
    </Block>
  )
}

export default AtListItem;
