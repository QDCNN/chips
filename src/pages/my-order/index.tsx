import CustomNavigationBar from '@/custom-navigation-bar'
import { View, Image, Text, Button } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.less'
import './index.sass'
import { Routes } from '@/routes'
import Taro from '@tarojs/taro'
import ListItem from '@/components/ListItem'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { useState } from 'react'


const MyOrder = () => {

  const [tabsCurrent, setTabsCurrent] = useState(0)

  const onTabsChange = (e) => {
    setTabsCurrent(e)
  }


  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back notFixed title="我的订单" />
      <AtTabs
        onClick={onTabsChange}
        current={tabsCurrent}
        tabList={[
          {
            title: '待支付'
          },
          {
            title: '已支付'
          },
        ]}
      >
        <AtTabsPane index={0} current={tabsCurrent}>
          <View className={classnames('container')}>
            <View className={classnames('fiche', styles.order_card)}>
              <View className={styles.order_number}>
                <View className={styles.order_number_text}>
                  <Text>订单编号：345678909766775634</Text>
                </View>
              </View>
              <ListItem
                title={'我的订单'}
                extraText={'留学生一站式落户'}
                border
              ></ListItem>
              <ListItem
                title={'下单时间'}
                extraText={'2022-07-02 13:33:33'}
                border
              ></ListItem>
              <ListItem
                title={'服务编号'}
                extraText={'123456789'}
                border
              ></ListItem>
              <ListItem
                title={'签约人'}
                extraText={'崔正'}
                border
              ></ListItem>
              <ListItem
                title={'身份证号'}
                extraText={'410223199904249830'}
                border
              ></ListItem>
              <ListItem
                title={'手机号'}
                extraText={'16602116366'}
                border
              ></ListItem>
              <ListItem
                title={'应付款'}
                extraText={'￥4,999.00'}
                border
              ></ListItem>
              <ListItem
                title={'实付款'}
                extraText={'￥4,999.00'}
              ></ListItem>
            </View>
          </View>
        </AtTabsPane>
        <AtTabsPane index={1} current={tabsCurrent}>
          <View className={classnames('container')}>
            <View className={classnames('fiche', styles.order_card)}>
              <View className={styles.order_number}>
                <View className={styles.order_number_text}>
                  <Text>订单编号：345678909766775634</Text>
                </View>
              </View>
              <ListItem
                title={'我的订单'}
                extraText={'留学生一站式落户'}
                border
              ></ListItem>
              <ListItem
                title={'下单时间'}
                extraText={'2022-07-02 13:33:33'}
                border
              ></ListItem>
              <ListItem
                title={'服务编号'}
                extraText={'123456789'}
                border
              ></ListItem>
              <ListItem
                title={'签约人'}
                extraText={'崔正'}
                border
              ></ListItem>
              <ListItem
                title={'身份证号'}
                extraText={'410223199904249830'}
                border
              ></ListItem>
              <ListItem
                title={'手机号'}
                extraText={'16602116366'}
                border
              ></ListItem>
              <ListItem
                title={'应付款'}
                extraText={'￥4,999.00'}
                border
              ></ListItem>
              <ListItem
                title={'实付款'}
                extraText={'￥4,999.00'}
              ></ListItem>
            </View>
          </View>
        </AtTabsPane>


      </AtTabs>

    </View >
  )
}

export default MyOrder;
