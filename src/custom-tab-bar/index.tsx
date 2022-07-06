import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { Image, View } from '@tarojs/components';
import React, { useState } from 'react';
import TabbarItem from './components/TabbarItem';
import styles from './index.module.less';
import { useDispatch, useSelector } from 'react-redux';
// import { actionCreator, RootState } from '@/store';
// import { handleToJDMiniProgram } from '@/utils';
import { Routes } from '@/routes';
// import { Routes } from '@/app.config';

export const tabbarList = [
  {
    pagePath: Routes.Home.slice(1),
    text: '首页',
    // iconPath: require('./assets/home.png'),
  },
  {
    pagePath: Routes.Work.slice(1),
    text: '我的',
    // iconPath: require('./assets/mine.png'),
  },
];

const CustomTabBar = (props) => {
  const handleItemClick = (tabbar) => {
    Taro.switchTab({ url: '/' + tabbar.pagePath });
  };

  return (
    <View className={styles.tabbarBox}>
      <View className={styles.tabbar}>
        {tabbarList.map((tabbar, index) => (
          <TabbarItem key={index} active={false} image={tabbar.iconPath} title={tabbar.text} onClick={() => handleItemClick(tabbar)} />
        ))}
      </View>
      {/* <Image className={styles.backgroundImage} src={require('./assets/tabbar-background.png')} mode="widthFix" /> */}
    </View>
  );
}

export default CustomTabBar;
