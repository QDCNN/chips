import { Routes } from './routes';

export const pages = Object.values(Routes).map(item => item.slice(1));

export const tabBarList = [
  {
    pagePath: Routes.Home.slice(1),
    text: '首页',
    iconPath: './assets/tabbar/home.png',
    selectedIconPath: './assets/tabbar/home-selected.png',
  },
  {
    pagePath: Routes.Work.slice(1),
    text: '办事',
    iconPath: './assets/tabbar/work.png',
    selectedIconPath: './assets/tabbar/work-selected.png',
  },
];

export default defineAppConfig({
  pages,
  tabBar: {
    custom: false,
    // 使用custom-tab-bar
    // color: 'rgba(0, 0, 0, 0.6)',
    // selectedColor: 'rgba(0, 162, 0, 1)',
    // backgroundColor: '#fff',
    // borderStyle: 'white',
    // 这些配置无法省略 同时需要注意pagePath和图片路径的配置
    // 如果这里图片路径没有配置或配置出错的话，图片icon不会显示
    list: tabBarList
  },

  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
