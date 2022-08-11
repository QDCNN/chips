import { useState } from 'react';
import styles from './index.module.less'
import { usePrefixCls } from '@/__builtins__';
import { Block, Icon, Image, Text, View } from '@tarojs/components';
import cls from 'classnames';


enum BadgeType {
  BadgeType10 = '10',
  BadgeType20 = '20',
}

const badgeTypeColor = {
  [BadgeType.BadgeType10]: 'background-color:#0d8bcc;',
  [BadgeType.BadgeType20]: 'background-color:#07c160;',
}

const badgeTypeText = {
  [BadgeType.BadgeType10]: '进行中',
  [BadgeType.BadgeType20]: '线上办结',
}


const Badge = (props) => {

  const {
    isLink, className, inForm, inline, hover, extHoverClass,
    iconClass, icon, title, value, children, avatar,
    footerClass, showError, error, style, dot, content,
    desc, status,
    ...resetProps
  } = props;
  const prefixCls = usePrefixCls('cell', props);

  const [badgeType, setBadgeType] = useState(BadgeType[`BadgeType${status}`])

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
              <Image src={icon} className={cls(prefixCls + '__icon')} mode="aspectFit" style={{ width: '48rpx', height: '48rpx', marginRight: '8rpx' }} />
            </Block>
          )}

          {title && (
            <Block>
              <View className={cls({ 'weui-label': inForm })}>
                <Text>
                  {/* {title} */}
                  {badgeTypeText[badgeType]}
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
              <View className={`${prefixCls}__dot`} style={badgeTypeColor[badgeType]}></View>
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



    // <View className={styles.badge}>
    //   <View className={styles.left}>
    //     <View className={styles.content}>
    //       <Text className={styles.title}>{badgeTypeText[badgeType]}</Text>
    //     </View>
    //     <View className={styles.status} style={badgeTypeColor[badgeType]}></View>
    //   </View>
    //   <View className={styles.iconRight}>
    //     <Image src={RightIcon} className={styles.icon}></Image>
    //   </View>
    // </View>
  );
}

export default Badge;
