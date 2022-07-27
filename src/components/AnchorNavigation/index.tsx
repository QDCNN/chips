import classnames from 'classnames';

import { Image, ScrollView, Text, View } from '@tarojs/components';
import React, {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState
} from 'react';

import styles from './index.module.less';
import { AnchorNavigationData, AnchorNavigationShowType } from './type';

const AnchorNavigation = ({
  value = [],
  onClick
}: { value: any[], onClick?: any }) => {
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [matchedIndex, setMatchedIndex] = useState(-1);
  const anchorRef = useRef<any>();
  const [scrollIntoView, setScrollIntoView] = useState('');
  const insideAnchorRef = useRef<any>();
  // const currentNodeRect = useMemo(() => stickyList[componentIndex!] || { fixed: false }, [stickyList, componentIndex]);

  // const updateState = useCallback(
  //   idx => {
  //     if (scroll) {
  //       // 标签栏滚动
  //       switch (ENV) {
  //         case Taro.ENV_TYPE.WEAPP:
  //         case Taro.ENV_TYPE.ALIPAY:
  //         case Taro.ENV_TYPE.SWAN:
  //           const index = Math.max(idx - 1, 0);
  //           setScrollIntoView(`tab${index}`);
  //           break;

  //         case Taro.ENV_TYPE.WEB: {
  //           const childIndex = Math.max(idx - 1, 0);
  //           if (!anchorRef.current.container) return;
  //           const prevTabItem = anchorRef.current.container.childNodes[childIndex];
  //           if (prevTabItem) {
  //             setScrollTop(prevTabItem.offsetTop);
  //             setScrollLeft(prevTabItem.offsetLeft);
  //           }
  //           break;
  //         }

  //         default:
  //           console.warn('AtTab 组件在该环境还未适配');
  //           break;
  //       }
  //     }
  //   },
  //   [scroll],
  // );

  // useEffect(() => {
  //   updateState(current);
  // }, [current, updateState]);

  useLayoutEffect(() => {
    let currentFocus = 0;
    // nodeRectList.forEach(nodeRect => {
    //   if (viewScrollTop! > nodeRect.top) currentFocus++;
    // });

    const matchIndex = value.findIndex(item => item.index == currentFocus);
    if (matchIndex > -1) setMatchedIndex(matchIndex);
  }, [value]);
  const currentIndex = useMemo(() => (matchedIndex > -1 ? matchedIndex : current), [matchedIndex, current]);

  const handleClick = (item, index) => {
    onClick && onClick(item, index);
    setMatchedIndex(-1);
    setCurrent(index);
  };
  return (
    <View
      ref={anchorRef as any}
      className={classnames(styles.nav)}
    >
      <ScrollView
        ref={insideAnchorRef as any}
        scrollX
        scrollWithAnimation
        className={classnames(styles.anchorNavigation)}
        scrollIntoView={scrollIntoView}
        scrollLeft={scrollLeft}
        scrollTop={scrollTop}
      >
        <View>
          {value.map((item, index) => (
            <View
              id={`tab${index}`}
              key={index}
              className={classnames('item', styles.item, {
                [styles.itemActive]: currentIndex === index,
              })}
              onClick={() => handleClick(item, index)}
            >
              {item.image && <Image className={styles.itemImage} src={item.image} mode="widthFix" />}
              <View>
                <Text>
                  {item.title || item.name}
                </Text>
              </View>
              <View>
                <Text>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
          {!value.length ? '没有数据' : null}
        </View>
      </ScrollView>
    </View>
  );
};

export * from './type';
export default AnchorNavigation;
