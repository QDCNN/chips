import { View, Text } from '@tarojs/components'
import styles from './index.module.less'
import classnames from 'classnames'
import Taro from '@tarojs/taro'
import { Routes } from '@/routes'
import CustomNavigationBar from '@/custom-navigation-bar'
import ListItem from '@/components/ListItem'
import orderIcon from '@/assets/icon/order.svg'
import rightIcon from '@/assets/icon/right.svg'
import { useEffect } from 'react'
import Badge from './components/badge'
import * as weixinAPI from '@/api'
import { useDuraArray } from '@/hooks/use-dura'
import { combineQuery } from '@/utils/route'
import AtListItem from '@/components/AtListItem'
import classNames from 'classnames'


const model = {
  state: () => ({
    taskList: [],
    task_status: [],
  }),
  reducers: () => ({
    setTaskList(state, data) {
      state.taskList = data.list || [];
      state.task_status = data.task_status || [];
    },
  }),
  effects: ({ dispatch, actionCreator }) => ({

    async getTaskList() {
      const { data } = await weixinAPI.getTaskList({ page: '', limit: '' })
      dispatch(actionCreator.setTaskList(data))
    }
  }),
};


const Work = () => {
  const [dState, dDispatch, dActionCreator] = useDuraArray(model);
  console.log('task_status', dState.task_status);

  useEffect(() => {
    dDispatch(dActionCreator.getTaskList())
  }, [])

  console.log('dState.taskList', dState.taskList);


  const onMyOrder = () => {

    Taro.navigateTo({
      url: Routes.MyOrder
    })
  }

  const onHandelClick = (item) => {
    // switch (item.task_status) {
    //   case 10:
    //     console.log('10');
    //     break;
    //   case 20:
    //     console.log('20');
    //     break;
    //   default:
    //     console.log('无状态');
    //     break;
    // }
    // if (item.task_status === '10')
    Taro.navigateTo({ url: combineQuery(Routes.FormPage, { id: item.task_id }) })
  }
  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar notFixed title="办事" />

      <View className="container">
        <View className='fiche'>
          {/* <ListItem
            iconLeft={orderIcon}
            title={'我的订单'}
            iconRight={rightIcon}
            onClick={onMyOrder}
          ></ListItem> */}
          <AtListItem
            isLink
            title='我的订单'
            icon={orderIcon}
            onClick={onMyOrder}
          >
          </AtListItem>
        </View>
        {dState.taskList.map(item => (
          <View className={classnames('fiche', 'm-t-32', styles.block)}>
            <View className={styles.top}>
              <View className={styles.title}>
                <Text>{item?.title}</Text>
              </View>
              <View className={styles.content}>
                <View className={classNames('weui-cell__desc')}><Text>服务编号：{item?.task_no}</Text></View>
                <View className={classNames('weui-cell__desc')}><Text>咨询老师：{item?.service_qywx_user_name}</Text></View>
                <View className={classNames('weui-cell__desc')}><Text>审核老师：{item?.review_qywx_user_name}</Text></View>
                <View className={classNames('weui-cell__desc')}><Text>创建时间：{item?.create_time}</Text></View>
              </View>
            </View>
            <Badge status={item.task_status} isLink title dot onClick={() => onHandelClick(item)} />
          </View>
        ))}
      </View>
    </View>
  )
}

export default Work;
