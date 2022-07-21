import { Image, Text, View } from '@tarojs/components';
import styles from './index.module.less'
import rightIcon from '@/assets/icon/right.svg'

const Contact = ({ avatar, username, intr, onClick }) => {
  return (
    <View className={styles.contact}>
      <View className={styles.contact_left}>
        <View className={styles.avatar_box}>
          <Image src={avatar} className={styles.avatar} mode='widthFix'></Image>
        </View>
        <View className={styles.nickname_box}>
          <View className={styles.nickname}>
            <Text>{username}</Text>
          </View>
          <View className={styles.introduce}>
            <Text>{intr}</Text>
          </View>
        </View>
      </View>
      <View className={styles.contact_right} onClick={onClick}>
        <Text className={styles.right_text}>去添加</Text>
        <Image src={rightIcon} className={styles.right_icon}></Image>
      </View>
    </View>
  );
}

export default Contact;
