import { Image, Text, View } from '@tarojs/components';
import { useState } from 'react';
import styles from './index.module.less'
import RightIcon from '@/assets/icon/right.svg'

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


const Badge = ({ status, onClick }) => {

  const [badgeType, setBadgeType] = useState(BadgeType[`BadgeType${status}`])

  return (
    <View className={styles.badge} onClick={onClick}>
      <View className={styles.left}>
        <View className={styles.content}>
          <Text className={styles.title}>{badgeTypeText[badgeType]}</Text>
        </View>
        <View className={styles.status} style={badgeTypeColor[badgeType]}></View>
      </View>
      <View className={styles.iconRight}>
        <Image src={RightIcon} className={styles.icon}></Image>
      </View>
    </View>
  );
}

export default Badge;
