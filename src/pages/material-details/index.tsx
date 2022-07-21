import CustomNavigationBar from '@/custom-navigation-bar'
import { View, Image, Text, Button } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.less'
import ZtInput from '@/components/Form/ZtInput'
import ListItem from './components/list-item'




const MyOrder = () => {

  const format = {
    pageTitle: '',
    title: '',
    type: '',
    value: '',
  }



  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back notFixed title="材料详情" />

      <View className={styles.container}>
        <ListItem
          type='title'
          title='标题'
        />
        <ListItem
          type='subtitle'
          subtitle='副标题'
        />
        <ListItem
          type='input'
          label='身份证号'
          value='410223199904249830'
        />
        <ListItem
          type='input'
          label='手机号'
          value='18317825035'
        />
        <ListItem
          type='watch'
          label='电子合同'
          value='查看'
        />

        {/* 
        <ZtInput
          title={'label'}
          type='title'
          value='订单信息'
          placeholder={'placeholder'}
        /> */}
        {/* <ZtInput
          title={'label'}
          type='input'
          value={'value'}
          placeholder={'placeholder'}
        /> */}

        {/* <ZtInput
          title={'label'}
          type='title'
          value='订单信息'
          placeholder={'placeholder'}
        />
        <ZtInput
          title={'label'}
          type='input'
          value={'value'}
          placeholder={'placeholder'}
        />
        <ZtInput
          title={'label'}
          type='textarea'
          value={'value'}
          placeholder={'placeholder'}
        />
        <ZtInput
          title={'label'}
          type='switch'
          value={'value'}
          placeholder={'placeholder'}
        />
        <ZtInput
          title={'label'}
          type='time'
          value={'value'}
          placeholder={'placeholder'}
        />
        <ZtInput
          title={'label'}
          type='date'
          value={'value'}
          placeholder={'placeholder'}
        /> */}

      </View>
    </View>
  )
}

export default MyOrder;
