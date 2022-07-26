import { View, Text } from '@tarojs/components'
import styles from './index.module.less'
import classnames from 'classnames'
import Taro from '@tarojs/taro'
import { Routes } from '@/routes'
import CustomNavigationBar from '@/custom-navigation-bar'
import ListItem from '@/components/ListItem'
import orderIcon from '@/assets/icon/order.svg'
import rightIcon from '@/assets/icon/right.svg'
import { useDuraArray } from '@/hooks/use-dura'
import * as serviceAPI from '@/api/service'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
// import { RootState } from '@/store'
import { actionCreator, RootState, store } from '@/store';
import Badge from './components/badge'


const model = {
  state: () => ({}),
  reducers: () => ({}),
  effects: ({ dispatch, actionCreator }) => ({}),
};
const Mine = () => {
  const [dState, dDispatch, dActionCreator] = useDuraArray(model);

  const { global: { taskList } } = useSelector((store: RootState) => store);

  const onMyOrder = () => {

    Taro.navigateTo({
      url: Routes.MyOrder
    })
  }
  useEffect(() => {
    store.dispatch(actionCreator.global.getTaskList())
  }, [])


  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar notFixed title="办事" />

      <View className="container">
        <View className='fiche'>
          <ListItem
            iconLeft={orderIcon}
            title={'我的订单'}
            iconRight={rightIcon}
            onClick={onMyOrder}
          ></ListItem>
        </View>
        {taskList.list.map(item => (
          <View className={classnames('fiche', 'm-t-32', styles.block)}>
            <View className={styles.top}>
              <View className={styles.title}>
                <Text>{item?.title}</Text>
              </View>
              <View className={styles.content}>
                <View className={styles.item}><Text>服务编号：{item?.task_no}</Text></View>
                <View className={styles.item}><Text>咨询老师：{item?.service_qywx_user_name}</Text></View>
                <View className={styles.item}><Text>审核老师：{item?.review_qywx_user_name}</Text></View>
                <View className={styles.item}><Text>创建时间：{item?.create_time}</Text></View>
              </View>
            </View>
            {/* <ListItem
              badge={1}
              iconRight={rightIcon}
            /> */}
            {/* <Badge status={item?.task_status} /> */}
            <Badge status={item.task_status} />
          </View>
        ))}
      </View>
    </View>
  )
}

export default Mine;
