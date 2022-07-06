import { Image, Text, View } from '@tarojs/components';
import styles from './index.module.less';

const TabbarItem = ({ image, title, onClick, active }) => {
  return (
    <View className={styles.tabbarItem} onClick={onClick}>
      <Image className={styles.image} src={image} mode="widthFix" />
    </View>
  );
}

export default TabbarItem;
