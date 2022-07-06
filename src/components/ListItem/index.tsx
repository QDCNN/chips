import { Image, Text, View } from '@tarojs/components';
import styles from './index.module.less';
import classnames from 'classnames';
import { useState } from 'react';


enum BadgeType {
  请提交资料 = 1,
  进行中 = 2,
  等待用户确认 = 3,
  线上办结 = 4,
}
const badgeTypeColor = {
  [BadgeType.请提交资料]: 'background-color:#fa5151;',
  [BadgeType.进行中]: 'background-color:#0d8bcc;',
  [BadgeType.等待用户确认]: 'background-color:#fa5151;',
  [BadgeType.线上办结]: 'background-color:#07c160;',
}


const ListItem = ({ iconLeft, title, badge, extraText, iconRight, className, onClick }) => {
  const [badgeType, setBadgeType] = useState(BadgeType[badge])



  return (
    <View className={classnames(className, styles.info_item)} >
      <View className={styles.item_left}>
        {iconLeft &&
          <View className={styles.icon_left}>
            <Image className={styles.icon} src={iconLeft} ></Image>
          </View>
        }
        <Text className={styles.left_text}>{title}</Text>
        {badge &&
          <View className={styles.badge} style={badgeTypeColor[badgeType]}>

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
        <View className={styles.icon_right} onClick={onClick}>
          <Image className={styles.icon} src={iconRight} ></Image>
        </View>
      }
    </View>
  );
}

export default ListItem;
