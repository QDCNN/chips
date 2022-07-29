import { Image, Text, View } from '@tarojs/components';
import styles from './index.module.less';
import classnames from 'classnames';


const ListItem = ({ iconLeft, title, border, extraText, time, iconRight, className, onClick }) => {

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
