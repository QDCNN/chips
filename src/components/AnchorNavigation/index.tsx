import classnames from 'classnames';

import { Image, ScrollView, Text, View } from '@tarojs/components';
import React, {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState
} from 'react';

import styles from './index.module.less';
import { weappBoundingClientRect } from '@/utils/dom';
import { delay } from '@/utils';
import Taro, { usePageScroll } from '@tarojs/taro';
import { throttle } from 'lodash'

const ENV = Taro.getEnv()

const AnchorNavigation = ({
  value = [],
  // scrollTop = 0,
  onClick
}: { value: any[], onClick?: any, scrollTop: number }) => {
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const nodeRectList = useRef<any[]>([]);
  const [matchedIndex, setMatchedIndex] = useState(-1);
  const anchorRef = useRef<any>();
  const [scrollIntoView, setScrollIntoView] = useState('');
  const insideAnchorRef = useRef<any>();
  const [scrollTop, setScrollTop] = useState(0);
  // const currentNodeRect = useMemo(() => stickyList[componentIndex!] || { fixed: false }, [stickyList, componentIndex]);

  const updateState = useCallback(
    idx => {
      if (scrollTop) {
        // 标签栏滚动
        switch (ENV) {
          case Taro.ENV_TYPE.WEAPP:
          case Taro.ENV_TYPE.ALIPAY:
          case Taro.ENV_TYPE.SWAN:
            const index = Math.max(idx - 1, 0);
            setScrollIntoView(`tab_${index}`);
            break;

          case Taro.ENV_TYPE.WEB: {
            const childIndex = Math.max(idx - 1, 0);
            if (!anchorRef.current.container) return;
            const prevTabItem = anchorRef.current.container.childNodes[childIndex];
            if (prevTabItem) {
              // setScrollTop(prevTabItem.offsetTop);
              setScrollLeft(prevTabItem.offsetLeft);
            }
            break;
          }

          default:
            console.warn('AtTab 组件在该环境还未适配');
            break;
        }
      }
    },
    [scrollTop],
  );

  const currentIndex = useMemo(() => (matchedIndex > -1 ? matchedIndex : current), [matchedIndex, current]);

  usePageScroll((rect) => {
    setScrollTop(rect.scrollTop);
    updateState(currentIndex);
  });

  const generateRectTopList = async () => {
    await delay(0);
    const queryNodeRectList = await Promise.all(value.map(item => weappBoundingClientRect(item.id)));
    nodeRectList.current = queryNodeRectList;
  }

  useLayoutEffect(() => {
    let currentFocus = 0;
    nodeRectList.current.forEach(nodeRect => {
      if (scrollTop! > nodeRect.top) currentFocus++;
    });

    if (currentFocus > -1) setMatchedIndex(currentFocus);
  }, [value, scrollTop]);

  useLayoutEffect(() => {
    // setTimeout(() => {
    generateRectTopList();
    // }, 0);
  }, [value]);

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
        // scrollTop={scrollTop}
      >
        <View>
          {value.map((item, index) => (
            <View
              id={`tab_${index}`}
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
          {/* {!value.length ? '没有数据' : null} */}
        </View>
      </ScrollView>
    </View>
  );
};

export * from './type';
export default AnchorNavigation;
