import { Image, Text, View } from '@tarojs/components';
import styles from './index.module.less';
import classnames from 'classnames';
import { useState } from 'react';


enum BadgeType {
  BadgeType1 = '请提交资料',
  BadgeType2 = '进行中',
  BadgeType3 = '等待用户确认',
  BadgeType4 = '线上办结',
  // 请提交资料 = 1,
  // 进行中 = 2,
  // 等待用户确认 = 3,
  // 线上办结 = 4,
}
const badgeTypeColor = {
  [BadgeType.BadgeType1]: 'background-color:#fa5151;',
  [BadgeType.BadgeType2]: 'background-color:#0d8bcc;',
  [BadgeType.BadgeType3]: 'background-color:#fa5151;',
  [BadgeType.BadgeType4]: 'background-color:#07c160;',

  // [BadgeType.请提交资料]: 'background-color:#fa5151;',
  // [BadgeType.进行中]: 'background-color:#0d8bcc;',
  // [BadgeType.等待用户确认]: 'background-color:#fa5151;',
  // [BadgeType.线上办结]: 'background-color:#07c160;',
}
const badgeTypeText = {
  [BadgeType.BadgeType1]: '请提交资料',
  [BadgeType.BadgeType2]: '进行中',
  [BadgeType.BadgeType3]: '等待用户确认',
  [BadgeType.BadgeType4]: '线上办结',

}


const ListItem = ({ iconLeft, title, border, badge, extraText, time, iconRight, className, onClick }) => {
  const [badgeType, setBadgeType] = useState(BadgeType[`BadgeType${badge}`])

  return (
    <View className={classnames(className, styles.info_item, border ? 'info_item_border' : '')} onClick={onClick} >
      <View className={styles.item_left}>
        {iconLeft &&
          <View className={styles.icon_left}>
            <Image className={styles.icon} src={iconLeft} ></Image>
          </View>
        }
        <View className={styles.item_title}>
          <Text className={styles.left_text}>{title}</Text>
          {time && (
            <View className={styles.time_pay}>
              <Text>请在{time}内完成付款</Text>
            </View>
          )}

        </View>

        {badge &&
          <View>
            <Text className={styles.left_text}>{badgeTypeText[badgeType]}</Text>
            <View className={styles.badge} style={badgeTypeColor[badgeType]}></View>
          </View>
        }
      </View>

      {extraText &&
        <View className={styles.item_right}>
          <Text className={styles.right_text}>{extraText}</Text>
        </View>
      }
      {
        iconRight &&
        <View className={styles.icon_right}>
          <Image className={styles.icon} src={iconRight} ></Image>
        </View>
      }
    </View>
  );
}

export default ListItem;
