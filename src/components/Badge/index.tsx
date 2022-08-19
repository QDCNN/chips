import { View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.less'

export const Badge = (props) => {
  const { type = 'primary' } = props;
  const cls = classNames({
    [styles.badge]: true,
    [styles.badgePrimary]: type == 'primary',
    [styles.badgeInfo]: type == 'info',
  });

  return (
    <View className={cls} />
  )
}

export default Badge;
