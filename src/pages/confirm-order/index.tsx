import { Routes } from '@/routes'
import { View, Form, Button, Picker, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.less'
import CustomNavigationBar from '@/custom-navigation-bar'
import ListItem from '@/components/ListItem'
import addressIcon from '@/assets/icon/address.svg'
import rightIcon from '@/assets/icon/right.svg'
import IdentityCodeValid from '@/utils/validateId'
import IdentityPhoneValid from '@/utils/validatePhone'
import { AtButton, AtForm, AtInput, AtList, AtListItem } from 'taro-ui'
import './index.sass'
import { useDuraArray } from '@/hooks/use-dura'
import FormItem from '@/components/FormItem'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import * as API from '@/api/index'



const model = {
  state: () => ({
    formData: {
      name: '',
      idcard: '',
      mobile: '',
      // address: '',
    },
    isIdCard: false,
    isPhone: false,
    regionSelector: ['美国', '中国', '巴西', '日本'],
    regionSelectorChecked: '中国',
    form: [
      {
        id: 0,
        title: 'input',
        type: 'input',
        placeholder: 'input',
      }
    ]
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
    setIsPhone(state, payload) {
      state.isPhone = !payload
    },
    setRegionSelectorChecked(state, payload) {
      state.regionSelectorChecked = payload
    }
  }),
  effects: ({ dispatch, actionCreator }) => ({
    async receiveCard(formData) {
      // await API.receiveCard(formData);
    }
  }),
};





const ConfirmOrder = () => {
  const { global: { goods, userInfo } } = useSelector((store: RootState) => store);

  const [dState, dDispatch, dActionCreator] = useDuraArray(model);

  const onPay = () => {
    console.log('提交表单', dState.formData);
    // Taro.navigateTo({ url: Routes.PayResultAwait })
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
        }))
      })
    })
  }

  useEffect(() => {
    Taro.login({
      success(result) {
        console.log('result', result);
      },
    })
  }, [])




  // 姓名
  const onChangeName = (res) => {
    dDispatch(dActionCreator.setFormDataPart({
      name: res
    }))
  }

  // 身份证号
  const onChangeIdCard = (res) => {
    let idCardError = IdentityCodeValid(res)
    dDispatch(dActionCreator.setIsIdCard(idCardError))
    dDispatch(dActionCreator.setFormDataPart({
      idcard: res
    }))
  }
  // 手机号
  const onChangePhone = (res) => {
    let phoneError = IdentityPhoneValid(res)
    dDispatch(dActionCreator.setIsPhone(phoneError))
    dDispatch(dActionCreator.setFormDataPart({
      mobile: res
    }))
  }

  // 选择器
  const onChangeRegion = (res) => {
    dDispatch(dActionCreator.setRegionSelectorChecked(
      dState.regionSelector[res.detail.value]
    ))
  }




  const getFormDate = (e) => {
    // API.buynow()
    // console.log('submit', e.detail.value);
    console.log('formData', dState.formData);


    console.log('goods', goods[0].goods_id);

    console.log('openid', userInfo);

    let formDate = {
      ...dState.formData,
      goods_id: goods[0].goods_id,
      ...dState.formData,
    }
    console.log('formDate', formDate);

    API.buynow({ ...formDate }).then(res => {
      if (res.code === 200) {
        console.log('支付数据', res);
        Taro.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: (res) => {
            console.log('支付', res);
          }
        })
      }
    })

  }


  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back notFixed title="确认订单" />
      <View className={classnames('container', styles.container)}>
        <View className='fiche'>
          <ListItem
            iconLeft={addressIcon}
            title={dState.formData.address ? dState.formData.address : '请选择收货地址'}
            iconRight={dState.formData.address ? '' : rightIcon}
            onClick={getAddress}
          ></ListItem>
        </View>
        <View className={classnames('m-t-48', 'fiche', styles.list_box)}>
          <ListItem
            border
            title='服务信息'
            extraText='留学生一站式落户服务'
          ></ListItem>
          <ListItem
            border
            title='咨询老师'
            extraText='Chon'
          ></ListItem>
          <ListItem
            border
            title='审核老师'
            extraText='支付后分配'
          ></ListItem>
          <ListItem
            className={styles.b_r}
            title='订单总价'
            extraText='￥4,999.00'
          ></ListItem>
        </View>
        {/* 
        <Form onSubmit={getFormDate} >
          <View className={classnames('m-t-48', 'fiche', styles.form_box)}>
            <FormItem
              clear
              name='userName'
              label='姓名'
              type='text'
              placeholder='请输入签约人姓名'
            />
            <FormItem
              name='idcard'
              clear
              error={dState.isIdCard}
              label='身份证号'
              placeholder={!dState.isIdCard ? '请输入签约人的身份证号' : '请输入正确的身份证号'}
              type='idcard'
            />
            <FormItem
              clear
              name='phone'
              error={dState.isPhone}
              label='手机号'
              type='phone'
              placeholder={dState.isPhone ? '请输入正确的手机号' : '请输入签约人手机号'}
            />
          </View>
          <View className={classnames('m-t-48', styles.submit)}>
            <Button
              formType='submit'
              type='primary'
              className={styles.submit_button}
            >提交</Button>
          </View>
        </Form> */}



        <AtForm className={classnames('m-t-48', 'fiche', styles.form_box)} onSubmit={(e) => { submit(e) }}>
          <ListItem
            border
            title='签约方式'
            extraText='在线合同'
          ></ListItem>
          <AtInput
            clear
            name='userName'
            focus={dState.formData.name}
            title='姓名'
            type='text'
            placeholder='请输入签约人姓名'
            value={dState.formData.name}
            onChange={onChangeName}
          />
          <AtInput
            key='idcard'
            focus={dState.formData.idcard}
            clear
            error={dState.isIdCard}
            title='身份证号'
            placeholder={!dState.isIdCard ? '请输入签约人的身份证号' : '请输入正确的身份证号'}
            placeholderStyle={!dState.isIdCard ? '' : "color:#ff4949"}
            type='idcard'
            value={dState.formData.idcard}
            onChange={onChangeIdCard}
          />
          <AtInput
            clear
            key='phone'
            focus={dState.formData.mobile}
            error={dState.isPhone}
            title='手机号'
            type='phone'
            placeholder={dState.isPhone ? '请输入正确的手机号' : '请输入签约人手机号'}
            placeholderStyle={dState.isPhone ? "color:#ff4949" : ''}
            value={dState.formData.mobile}
            onChange={onChangePhone}
          />
          {/* <Picker mode='selector' range={dState.regionSelector} onChange={onChangeRegion} >
            <ListItem
              title='国家地区'
              extraText={dState.regionSelectorChecked}
            />
          </Picker> */}
        </AtForm>
        <View className={classnames('m-t-48', styles.submit)}>
          {/* <AtButton className={styles.submit_button} formType='submit' type='primary'>去支付</AtButton> */}
          <Button
            formType='submit'
            type='primary'
            className={styles.submit_button}
            onClick={getFormDate}
          >提交</Button>
        </View>
      </View>
    </View >
  )
}

export default ConfirmOrder;
