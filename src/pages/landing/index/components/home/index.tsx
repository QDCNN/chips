import { LandingImage } from '@/config/landing';
import { View, Image, Text } from '@tarojs/components';
import styles from './index.module.less';
import classnames from 'classnames';

const HomePage = ({ onClick }) => {
  return (
    <View className={styles.page}>
      <View className={styles.container}>
        <View className={styles.top}>
          <View className={styles.logo}>
            <Image className={styles.logoImage} src={LandingImage.Logo} mode="widthFix" />
          </View>

          <View className={styles.description}>
            <Image className={styles.descriptionImage} src={LandingImage.LogoDescription} mode="widthFix" />
          </View>

          <View className={styles.star}>
            <Image className={styles.starImage} src={LandingImage.HomeStar} mode="widthFix" />
          </View>
        </View>


        <View className={styles.footer}>
          <Image className={styles.startButton} src={LandingImage.StartButton} mode="widthFix" onClick={onClick} />

          <View className={classnames(styles.footerText, styles.primaryColor)}>
            <Text>获得属于自己的数字藏品吧</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default HomePage;
