import { Label, Text, View } from '@tarojs/components';
import styles from '../index.module.less'
const ListItem = ({ type, title, subtitle, label, value }) => {
  return (
    <View className={styles.list_item}>
      {type === 'title' && (
        <View className={styles.list_item_title}>
          <Text className={styles.list_title}>标题</Text>
        </View>
      )}
      {
        type === 'subtitle' && (
          <View className={styles.list_item_subtitle}>
            <Text className={styles.list_subtitle}>副标题</Text>
          </View>
        )
      }
      {
        type === 'input' && (
          <View className={styles.list_item_input}>
            <View className={styles.list_item_left}>
              <Label className={styles.list_label}>{label}</Label>
            </View>
            <View className={styles.list_item_right}>
              <View className={styles.list_value}>{value}</View>
            </View>
          </View>
        )
      }
      {
        type === 'watch' && (
          <View className={styles.list_item_select}>
            <View className={styles.list_item_left}>
              <Label className={styles.list_label}>{label}</Label>
            </View>
            <View className={styles.list_item_right}>
              <View className={styles.list_value}>{value}</View>

            </View>
          </View>
        )
      }
    </View>
  );
}

export default ListItem;
