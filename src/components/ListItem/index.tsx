import { Image, Text, View } from '@tarojs/components';
import styles from './index.module.less';
import classnames from 'classnames';


const ListItem = ({ iconLeft, title, border, extraText, time, iconRight, className, onClick }) => {

  return (
    <View className={classnames(className, styles.infoItem, border ? 'info_item_border' : '')} onClick={onClick} >
      <View className={styles.itemLeft}>
        {iconLeft &&
          <View className={styles.iconLeft}>
            <Image className={styles.icon} src={iconLeft} ></Image>
          </View>
        }
        <View >
          <Text >{title}</Text>

          {time && (
            <View className={styles.timePay}>
              <Text>请在{time}内完成付款</Text>
            </View>
          )}

        </View>
      </View>

      {extraText &&
        <View className={styles.itemRight}>
          <Text className={styles.rightText}>{extraText}</Text>
        </View>
      }
      {
        iconRight &&
        <View className={styles.iconRight}>
          <Image className={styles.icon} src={iconRight} ></Image>
        </View>
      }
    </View>
  );
}

export default ListItem;
