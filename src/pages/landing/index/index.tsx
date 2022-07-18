import { Image, View } from '@tarojs/components'
import styles from './index.module.less'
import classnames from 'classnames'
import Taro from '@tarojs/taro'
import HomePage from './components/home'
import FogPage from './components/fog'
import IntroducePage from './components/introduce'
import { useState } from 'react'
import { LandingImage } from '@/config/landing'


enum PageState {
  Init = 'init',
  Fog = 'fog',
  Introduce = 'introduce',
}


const LandingHome = () => {
  const [pageState, setPageState] = useState(PageState.Init);
  const [catchMove, setCatchMove] = useState(true);

  const [kvFogAnimation, setKVFogAnimation] = useState<any>(null);
  const [kvOriginAnimation, setKVOriginAnimation] = useState<any>(null);

  const [firstAnimation, setFirstAnimation] = useState<any>(null);
  const [secondAnimation, setSecondAnimation] = useState<any>(null);

  const onStartClick = () => {
    Taro.pageScrollTo({
      scrollTop: 1000,
      duration: 1000,
      complete: () => setPageState(PageState.Fog)
    });
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onFogPageAnimationEnd = () => {
    console.log('before onAnimationEnd');
    setTimeout(() => {
      console.log('in onAnimationEnd');
      // // 迷雾页
      // const animation1 = Taro.createAnimation({
      //   duration: 2000,
      //   timingFunction: 'ease',
      // });


      // // 介绍页
      // const animation2 = Taro.createAnimation({
      //   duration: 2000,
      //   timingFunction: 'ease',
      // });
      // animation1.opacity(0);
      // setFirstAnimation(animation1.export());

      // animation2.opacity(1);
      // setSecondAnimation(animation2.export());
      // setCatchMove(false);
    }, 3000);
  };

  const onIntroduceClick = (rectTop) => {
    // Taro.pageScrollTo({ scrollTop: rectTop });
  };

  const handleAnimationEnd = () => console.log('handleAnimationEnd');

  const onAnimationStart = () => {
    // 迷雾 KV 动画
    const animation1 = Taro.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    });
    animation1.opacity(0).step();

    // 原 KV 动画
    const animation2 = Taro.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    });
    animation2.opacity(1).step();

    setKVFogAnimation(animation1.export());
    setKVOriginAnimation(animation2.export());

    setPageState(PageState.Introduce);
  };

  return (
    <View catchMove={catchMove} onTouchMove={onTouchMove}>
      <View
        className={classnames({ [styles.invisible]: pageState !== PageState.Init })}
      >
        <HomePage onClick={onStartClick} />
      </View>

      <View className={styles.introduceBox}>
        <View className={styles.kvBox}>
          <View className={styles.kvFog} animation={kvFogAnimation} onAnimationEnd={handleAnimationEnd}>
            <Image src={LandingImage.KVFog} mode="widthFix" />
          </View>

          <View className={styles.kvOrigin} animation={kvOriginAnimation} onAnimationEnd={handleAnimationEnd}>
            <Image src={LandingImage.KVOrigin} mode="widthFix" />
            <View className={classnames(styles.kvText, { [styles.invisible]: pageState !== PageState.Introduce })}>见证宝宝无限未来的数字藏品</View>
          </View>
        </View>

        <View
          className={classnames(styles.fogPage, { [styles.fadeOut]: pageState === PageState.Introduce })}
        // className={classnames({ [styles.invisible]: pageState === PageState.Introduce, [styles.visible]: pageState !== PageState.Introduce })}
        // animation={firstAnimation}
        // onTransitionEnd={onFogAnimationEnd}
        // onAnimationEnd={() => { }}
        >
          <FogPage onAnimationStart={onAnimationStart} onCustomAnimationEnd={onFogPageAnimationEnd} />
        </View>

        <View
          className={classnames(styles.introducePage, { [styles.fadeIn]: pageState === PageState.Introduce })}
        // // className={classnames(styles.introducePage, { [styles.hidden]: pageState !== PageState.Introduce })}
        // animation={secondAnimation}
        // onAnimationEnd={() => { }}
        >
          <IntroducePage onClick={onIntroduceClick} />
        </View>
      </View>
    </View>
  )
}

export default LandingHome;
