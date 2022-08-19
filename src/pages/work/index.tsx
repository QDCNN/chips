// import { View, Text } from '@tarojs/components'
// import styles from './index.module.less'
// import classnames from 'classnames'
// import Taro from '@tarojs/taro'
// import { Routes } from '@/routes'
// import ListItem from '@/components/ListItem'
// import orderIcon from '@/assets/icon/order.svg'
// import rightIcon from '@/assets/icon/right.svg'
// import { useEffect } from 'react'
// import Badge from './components/badge'
// import { useDuraArray } from '@/hooks/use-dura'
// import { combineQuery } from '@/utils/route'
// import AtListItem from '@/components/AtListItem'
// import classNames from 'classnames'
// import { CommonApi } from '@/api'


// const model = {
//   state: () => ({
//     taskList: [],
//     task_status: [],
//   }),
//   reducers: () => ({
//     setTaskList(state, data) {
//       state.taskList = data.list || [];
//       state.task_status = data.task_status || [];
//     },
//   }),
//   effects: ({ dispatch, actionCreator }) => ({

//     async getTaskList() {
//       const { data } = await CommonApi.getTaskList({ page: '', limit: '' })
//       dispatch(actionCreator.setTaskList(data))
//     }
//   }),
// };


// const Work = () => {
//   const [dState, dDispatch, dActionCreator] = useDuraArray(model);

//   useEffect(() => {
//     dDispatch(dActionCreator.getTaskList())
//   }, [])



//   const onMyOrder = () => {

//     Taro.navigateTo({
//       url: Routes.MyOrder
//     })
//   }

//   const onHandelClick = (item) => {
//     // switch (item.task_status) {
//     //   case 10:
//     //     console.log('10');
//     //     break;
//     //   case 20:
//     //     console.log('20');
//     //     break;
//     //   default:
//     //     console.log('无状态');
//     //     break;
//     // }
//     // if (item.task_status === '10')
//     Taro.navigateTo({ url: combineQuery(Routes.FormPage, { id: item.task_id }) })
//   }
//   return (
//     <View className={classnames(styles.page)}>

//       {/* <View className="container">
//         <View className='fiche'>
//           <ListItem
//             iconLeft={orderIcon}
//             title={'我的订单'}
//             iconRight={rightIcon}
//             onClick={onMyOrder}
//           ></ListItem>
//           <AtListItem
//             isLink
//             title='我的订单'
//             icon={orderIcon}
//             onClick={onMyOrder}
//           >
//           </AtListItem>
//         </View>
//         {dState.taskList.map(item => (
//           <View className={classnames('fiche', 'm-t-32', styles.block)}>
//             <View className={styles.top}>
//               <View className={styles.title}>
//                 <Text>{item?.title}</Text>
//               </View>
//               <View className={styles.content}>
//                 <View className={classNames('weui-cell__desc')}><Text>服务编号：{item?.task_no}</Text></View>
//                 <View className={classNames('weui-cell__desc')}><Text>咨询老师：{item?.service_qywx_user_name}</Text></View>
//                 <View className={classNames('weui-cell__desc')}><Text>审核老师：{item?.review_qywx_user_name}</Text></View>
//                 <View className={classNames('weui-cell__desc')}><Text>创建时间：{item?.create_time}</Text></View>
//               </View>
//             </View>
//             <Badge status={item.task_status} isLink title dot onClick={() => onHandelClick(item)} />
//           </View>
//         ))}
//       </View> */}
//     </View>
//   )
// }

// export default Work;

import { Routes } from '@/routes'
import { Form, Text, View } from '@tarojs/components'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import styles from './index.module.less'
import { useMemo, useState } from 'react'
import { CellGroup, Cell } from '@antmjs/vantui'
import { createDrawer } from '@/hooks/create-drawer'
import { commonResponsePipeline, formParamsPipeline } from '@/transformers'
import { CommonApi } from '@/api'
import { Badge } from '@/components'

const useDrawer = createDrawer(commonResponsePipeline(formParamsPipeline(CommonApi.getTaskList)), { defaultValue: { pagination: { pageSize: 3 } } });

const statusMapBadgeType = {
  10: 'primary',
  20: 'info',
}

const WorkPage = () => {
  const { drawer, toolkit } = useDrawer();
  const [taskStatus, setTaskStatus] = useState([]);

  const handleInit = async () => {
    const response = await toolkit.search();
    setTaskStatus(response.origin.task_status);
  };

  useDidShow(() => {
    handleInit();
  });

  const showTaskStatusText = (statusId) => {
    const match = taskStatus.find(item => item.id == statusId);
    return match ? match.value : '';
  };

  useReachBottom(() => {
    toolkit.loadMore();
  });

  usePullDownRefresh(() => {
    toolkit.search();
  });

  return (
    <View className={styles.page}>
      <View className={styles.mb32}>
        <CellGroup inset>
          <Cell title="我的订单" size="large" isLink url={Routes.OrderList} linkType="navigateTo" />
        </CellGroup>
      </View>

      <View className={styles.mb32}>
        {drawer.list.map(item => (
          <CellGroup className={styles.mb32} inset key={item.task_id}>
            <Cell
              title={item.title}
              size="large"
              renderLabel={(
                <View>
                  <View>
                    <Text>服务编号：{item.task_no}</Text>
                  </View>
                  <View>
                    <Text>咨询老师：{item.service_qywx_user_name}</Text>
                  </View>
                  <View>
                    <Text>审核老师：{item.review_qywx_user_name}</Text>
                  </View>
                  <View>
                    <Text>创建时间：{item.create_time}</Text>
                  </View>
                </View>
              )}
            />
            <Cell
              renderTitle={(
                <View>
                  <Text>{showTaskStatusText(item.task_status)}</Text>
                  <Badge type={statusMapBadgeType[item.task_status]} />
                </View>
              )}
              isLink
              size="large"
            />
          </CellGroup>
        ))}
      </View>
    </View>
  )
}

export default WorkPage;
