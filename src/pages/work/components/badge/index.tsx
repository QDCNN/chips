import { RootState } from '@/store';
import { Image, Text, View } from '@tarojs/components';
import { useSelector } from 'react-redux';
import styles from './index.module.less'

const Badge = (status) => {
  const { global: { taskList: { task_status } } } = useSelector((store: RootState) => store);
  console.log('taskList', task_status);

  let newArr = task_status.filter(item => {


    // item.id = status.status
  }
  )
  console.log('newArr', newArr);

  return (

    <View className={styles.badge}>
      {/* <View className={styles.badge_left}>
        <View className={styles.badge_content}>
          <Text className={styles.badge_title}>{newArr.value}</Text>
        </View>
        <View className={styles.badge_status}></View>
      </View> */}

      <View className={styles.icon_right}>
        <Image className={styles.icon}></Image>
      </View>
    </View>
  );
}

export default Badge;
