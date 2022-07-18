import { View, Text, Image, ScrollView } from '@tarojs/components';
import styles from './index.module.less';
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import { LandingImage } from '@/config/landing';
import { Routes } from '@/routes';

const IntroducePage = ({ onClick }) => {
  const onFormClick = () => Taro.navigateTo({ url: Routes.LandingForm })

  return (
    <View className={classnames(styles.page)}>
      <View className={styles.fixedPage}>
        <View className={styles.header}>
          <View className={styles.description}>
            <Text>感谢热心妈妈的指引魔法帮助~</Text>
          </View>
          <View className={styles.title}>
            <Text>0色素，让未来0阻碍</Text>
          </View>
          <View>
            <Text>星鲨AD 0色素给孩子一个纯净的成长道路素</Text>
          </View>
          <View>
            <Text>采用一级骨胶，胶囊皮天然无色</Text>
          </View>
          <View>
            <Text>现在宝宝正向着宝藏进发，美好的未来</Text>
          </View>
          <View>
            <Text>就在前方~</Text>
          </View>

          <View className={styles.slideArrowBox}>
            <Image className={styles.ownButton} src={LandingImage.OwnButton} mode="widthFix" onClick={onFormClick} />

            <View className={classnames(styles.description, styles.primaryColor)}>滑动了解完整会员权益</View>
            <Image className={styles.slideArrow} src={LandingImage.SlideArrow} mode="widthFix" />
          </View>
        </View>
      </View>

      <View id="content" className={styles.content}>
        <Image className={styles.productImage} src={LandingImage.ProductIntroduce1} mode="widthFix" />

        <Image className={styles.productImage} src={LandingImage.ProductIntroduce2} mode="widthFix" />
      </View>
    </View>
  );
}

export default IntroducePage;
