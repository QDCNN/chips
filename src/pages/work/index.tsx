import { Routes } from '@/routes'
import { Form, Text, View } from '@tarojs/components'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import styles from './index.module.less'
import { useMemo, useState } from 'react'
import { CellGroup, Cell } from '@antmjs/vantui'
import { createDrawer } from '@/hooks/create-drawer'
import { commonResponsePipeline, formParamsPipeline } from '@/transformers'
import { CommonApi } from '@/api'
import { combineQuery } from '@/utils/route'

const useDrawer = createDrawer(commonResponsePipeline(formParamsPipeline(CommonApi.getTaskList)), { defaultValue: { pagination: { pageSize: 20 } } });

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
              className={styles.iconstyle}
              title={item.title}
              size="large"
              isLink
              linkType="navigateTo"
              url={combineQuery(Routes.FormPage, { type: 'custom', name: 'file-document__form-home', id: item.task_id })}
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
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text style={{ color: item.task_status == 10 ? '#637ba3' : null }}>
                    {showTaskStatusText(item.task_status)}
                  </Text>
                </View>
              )}
              isLink
              size="large"
              linkType="navigateTo"
              url={combineQuery(Routes.FormPage, { type: 'custom', name: 'file-document__form-home', id: item.task_id })}
            />
          </CellGroup>
        ))}
      </View>
    </View >
  )
}

export default WorkPage;
