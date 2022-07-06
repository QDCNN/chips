import { Routes } from '@/routes'
import { View, Form, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.less'
import CustomNavigationBar from '@/custom-navigation-bar'
import ListItem from '@/components/ListItem'
import FormItem from '@/components/FormItem'
import addressIcon from '@/assets/icon/address.svg'
import rightIcon from '@/assets/icon/right.svg'
import { useState } from 'react'
import IdentityCodeValid from '@/utils/validateIdent'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import './index.sass'
import { useDuraArray } from '@/hooks/use-dura'



const model = {
  state: () => ({
    formData: {
      userName: '',
      idCard: '',
      phone: '',
      address: '',
    },
    isIdCard: false,
  }),
  reducers: () => ({
    setFormData(state, payload) {
      state.formData = payload;
    },
    setFormDataPart(state, payload) {
      for (const key in payload) {
        state.formData[key] = payload[key];
      }
    },
    setIsIdCard(state, payload) {
      state.isIdCard = !payload;
    },
  }),
  effects: ({ dispatch, actionCreator }) => ({
    async receiveCard(formData) {
      // await API.receiveCard(formData);
    }
  }),
};



const ConfirmOrder = () => {
  const [dState, dDispatch, dActionCreator] = useDuraArray(model);

  const onPay = () => {
    Taro.navigateTo({ url: Routes.PayResultAwait })
  }

  // 获取收货地址
  const getAddress = () => {
    console.log('获取收货地址');
    Taro.chooseAddress({
      success: (res => {
        console.log('收货地址', res);
        if (res.errMsg !== 'chooseAddress:ok') return;
        dDispatch(dActionCreator.setFormDataPart({
          address: `${res.userName} ${res.telNumber} ${res.cityName} ${res.countyName} ${res.detailInfo}`,
          phone: res.telNumber,
          userName: res.userName,
        }))
      })
    })
  }

  // 姓名
  const onChangeName = (res) => {
    dDispatch(dActionCreator.setFormDataPart({
      userName: res
    }))
  }

  // 身份证号
  const onChangeIdCard = (res) => {
    console.log('onChangeIdCard', res);
    let idCardError = IdentityCodeValid(res)
    console.log('idCardError', idCardError);
    dDispatch(dActionCreator.setIsIdCard(idCardError))
    dDispatch(dActionCreator.setIsIdCard(idCardError))
    dDispatch(dActionCreator.setFormDataPart({
      idCard: res
    }))
  }
  // 手机号
  const onChangePhone = (res) => {
    console.log('onChangePhone', res);
    dDispatch(dActionCreator.setFormDataPart({
      phone: res
    }))

  }
  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back notFixed title="确认订单" />
      <View className={classnames('container', styles.container)}>
        <View className='fiche'>
          <ListItem
            iconLeft={addressIcon}
            title={dState.formData.address ? dState.formData.address : '请输入收货地址'}
            extraText=''
            iconRight={dState.formData.address ? '' : rightIcon}
            onClick={getAddress}
          ></ListItem>
        </View>
        <View className={classnames('m-t-48', 'fiche', styles.list_box)}>
          <ListItem
            title='服务信息'
            extraText='留学生一站式落户服务'
          ></ListItem>
          <ListItem
            title='咨询老师'
            extraText='Chon'
          ></ListItem>
          <ListItem
            title='审核老师'
            extraText='支付后分配'
          ></ListItem>
          <ListItem
            className={styles.b_r}
            title='订单总价'
            extraText='￥4,999.00'
          ></ListItem>
        </View>
        <AtForm className={classnames('m-t-48', 'fiche', styles.form_box)}>
          <ListItem
            title='签约方式'
            extraText='在线合同'
          ></ListItem>
          <AtInput
            clear
            name='name'
            title='姓名'
            type='text'
            value={dState.formData.userName}
            placeholder='请输入签约人姓名'
            onChange={onChangeName}
          />
          <AtInput
            error={dState.isIdCard}
            title='身份证号'
            placeholder={!dState.isIdCard ? '请输入签约人的身份证号' : '请输入正确的身份证号'}
            placeholderStyle={!dState.isIdCard ? '' : "color:#ff4949"}
            type='idcard'
            value={dState.formData.idCard}
            onChange={onChangeIdCard}
          />
          <AtInput
            clear
            title='手机号'
            value={dState.formData.phone}
            type='phone'
            placeholder='请输入签约人手机号'
            onChange={onChangePhone}
          />
        </AtForm>

        {/* <Form className={classnames('m-t-48', 'fiche', styles.form_box)}>
          <ListItem
            title='签约方式'
            extraText='在线合同'
          ></ListItem>
          <FormItem
            label='姓名'
            value='姓名'
            type='text'
            placeholder='请输入签约人姓名'
          ></FormItem>
          <FormItem
            label='身份证号'
            value=''
            type='idcard'
            placeholder='请输入签约人身份证号'
            verify={IdentityCodeValid(410223199904249830)}
            onChange={onIdNumberChange}
          ></FormItem>
          <FormItem
            label='手机号'
            value=''
            type='number'
            placeholder='请输入签约人手机号'
          ></FormItem>
        </Form> */}
        <View className={classnames('m-t-48', styles.submit)}>
          <Button className={styles.submit_button} onClick={onPay} type='primary'>去支付</Button>
        </View>

      </View>
    </View >
  )
}

export default ConfirmOrder;
