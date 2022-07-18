import { LandingImage } from "@/config/landing";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRef, useState } from "react";
import styles from './index.module.less';

const FogPage = ({ onAnimationStart, onCustomAnimationEnd }) => {
  const [fogAnimation, setFogAnimation] = useState<any>(null);

  const handleClick = () => {
    onAnimationStart();
    // 迷雾动画
    const animation1 = Taro.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    });
    animation1.opacity(0).step();

    setFogAnimation(animation1.export());
  };

  const handleAnimationEnd = () => console.log('handleAnimationEnd');

  const onTransitionEnd = () => {
    console.log('onCustomAnimationEnd');
    onCustomAnimationEnd();
  }

  return (
    <View className={styles.page}>
      <View className={styles.top}>
        <View>
          <View>
            <Text>浩瀚的星海宇宙中</Text>
          </View>
          <View>
            <Text>蕴藏着神秘宝藏</Text>
          </View>
          <View>
            <Text>指引宝宝通往希望的未来</Text>
          </View>
        </View>

        <View className={styles.topFooter}>
          <View>
            <Text>但前方的路</Text>
          </View>
          <View>
            <Text>被色素迷雾遮住了</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>

        <View className={styles.fog} animation={fogAnimation} onAnimationEnd={handleAnimationEnd} onTransitionEnd={onTransitionEnd}>
          <Image className={styles.fogImage} src={LandingImage.FogMask} mode="widthFix" />
        </View>
      </View>

      <View className={styles.footer}>
        <Image
          className={styles.fogButton}
          src={LandingImage.FogButton}
          mode="widthFix"
          onClick={handleClick}
        />

        <View className={styles.footerText}>
          <View>
            <Text>点击按钮</Text>
          </View>
          <View>
            <Text>妈妈释放0色素魔法，</Text>
          </View>
          <View>
            <Text>消除色素迷雾！</Text>
          </View>
        </View>

        <View className={styles.animeBox}>
          <View className={styles.clickEffectBox}>
            <Image className={styles.clickEffectIn} src={LandingImage.ClickEffectIn} mode="widthFix" />
            <Image className={styles.clickEffectOut} src={LandingImage.ClickEffectOut} mode="widthFix" />
          </View>
          <Image className={styles.finger} src={LandingImage.Finger} mode="widthFix" />
        </View>
      </View>
    </View>
  );
}

export default FogPage;
