import { Image, Text, View } from '@tarojs/components';
import styles from './index.module.less'
import rightIcon from '@/assets/icon/right.svg'

const Contact = ({ avatar, username, intr, onClick }) => {
  return (
    <View className={styles.contact} onClick={onClick}>
      <View className={styles.left}>
        <View className={styles.avatarBox}>
          <Image src={avatar} className={styles.avatar} mode='widthFix'></Image>
        </View>
        <View className={styles.nicknameBox}>
          <View className={styles.nickname}>
            <Text>{username}</Text>
          </View>
          <View className={styles.introduce}>
            <Text>{intr}</Text>
          </View>
        </View>
      </View>
      <View className={styles.right} >
        <Text className={styles.rightText}>去添加</Text>
        <Image src={rightIcon} className={styles.rightIcon}></Image>
      </View>
    </View>
  );
}

export default Contact;
