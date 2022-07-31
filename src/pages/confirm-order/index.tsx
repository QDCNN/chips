import { View, Button, Form, Label, Input as TaroInput, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.less'
import CustomNavigationBar from '@/custom-navigation-bar'
import ListItem from '@/components/ListItem'
import { useDuraArray } from '@/hooks/use-dura'
import { useSelector, } from 'react-redux'
import * as yinghuoAPI from '@/api/yinghuo'
import { Routes } from '@/routes'
import { formatMoney } from '@/utils/formatMoney'
import { validateIdCard, validateMobile } from '@/utils/validateId'
import addressIcon from '@/assets/icon/address.svg'
import rightIcon from '@/assets/icon/right.svg'
import clearIcon from '@/assets/icon/clear.svg'
import { actionCreator, RootState, store } from '@/store';
import { useEffect } from 'react'
import AtListItem from '@/components/AtListItem'
import ATInputFix from '@/components/AtInputFix'

const model = {
  state: () => ({
    formData: {
      name: '',
      idcard: '',
      mobile: '',
    },
    isName: false,
    isIdCard: false,
    isPhone: false,
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
    setIsName(state, payload) {
      state.isName = !payload
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
      // await yinghuoAPI.receiveCard(formData);
    }
  }),
};





const ConfirmOrder = () => {

  const [dState, dDispatch, dActionCreator] = useDuraArray(model);
  const { global: { goodsList, goodsDetail, service } } = useSelector((store: RootState) => store);

  useEffect(() => {
    store.dispatch(actionCreator.global.getGoodsDetail())
  }, [])



  // 获取收货地址
  const getAddress = () => {
    Taro.chooseAddress({
      success: (res => {
        if (res.errMsg !== 'chooseAddress:ok') return;
        dDispatch(dActionCreator.setFormDataPart({
          address: `${res.userName} ${res.telNumber} ${res.cityName} ${res.countyName} ${res.detailInfo}`,
        }))
      })
    })
  }

  // 姓名
  const onChangeName = (res) => {
    console.log(res, 'res');
    dDispatch(dActionCreator.setIsName(res))
    dDispatch(dActionCreator.setFormDataPart({
      name: res
    }))
  }
  // 身份证号
  const onChangeIdCard = (res) => {
    let idCardError = validateIdCard(res)
    dDispatch(dActionCreator.setIsIdCard(idCardError))
    dDispatch(dActionCreator.setFormDataPart({
      idcard: res
    }))
  }
  // 手机号
  const onChangePhone = (res) => {
    let phoneError = validateMobile(res)
    dDispatch(dActionCreator.setIsPhone(phoneError))
    dDispatch(dActionCreator.setFormDataPart({
      mobile: res
    }))
  }




  const onSubmit = () => {
    if (!dState.formData.name) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' });
      return
    }
    if (dState.isIdCard) {
      Taro.showToast({ title: '请输入正确的身份证号', icon: 'none' });
      return
    }
    if (!dState.formData.idcard) {
      Taro.showToast({ title: '请输入身份证号', icon: 'none' });
      return
    }
    if (dState.isPhone) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!dState.formData.mobile) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    console.log('未拦截');

    let formDate = {
      ...dState.formData,
      goods_id: 10001,
      goods_sku_id: 0,
      goods_num: 1,
      delivery: 20,
      pay_type: 20,
      shop_id: 10001,
      coupon_id: 0,
      is_use_points: 0,
    }

    yinghuoAPI.buyNow({ ...formDate }).then(res => {
      console.log('支付数据', res);
      if (res.code === 1) {
        Taro.requestPayment({
          timeStamp: res.data.payment.timeStamp,
          nonceStr: res.data.payment.nonceStr,
          package: `prepay_id=${res.data.payment.prepay_id}`,
          signType: 'MD5',
          paySign: res.data.payment.paySign,
          success: (res) => {
            console.log('支付成功', res);
            Taro.reLaunch({
              url: Routes.PayResultSuccess
            })
          },
          fail: (res) => {
            Taro.reLaunch({
              url: Routes.MyOrder,
              success: () => {
                Taro.showToast({
                  title: '支付失败',
                  icon: 'error',
                  duration: 3000
                })
              }
            })
          },
        })
      }
    })
  }

  return (
    <View className={classnames('page', styles.page)}>
      <CustomNavigationBar back notFixed title="确认订单" />
      <View className={classnames('container', styles.container)}>
        <View className='fiche'>
          <AtListItem
            isLink
            icon={addressIcon}
            title='服务信息'
          >
            <View></View>
          </AtListItem>

          {/* <ListItem
            iconLeft={addressIcon}
            title={dState.formData.address ? dState.formData.address : '请选择收货地址'}
            iconRight={dState.formData.address ? '' : rightIcon}
            onClick={getAddress}
          ></ListItem> */}
        </View>
        <View className={classnames('m-t-48', 'fiche')}>
          <AtListItem title='服务信息'>
            {goodsList[0]?.goods_name}
          </AtListItem>
          <AtListItem title='咨询老师'>
            {service[0]?.name}
          </AtListItem>
          <AtListItem title='审核老师'>
            支付后分配
          </AtListItem>
          <AtListItem title='订单总价'>
            {`￥${formatMoney(goodsDetail?.goods_sku.goods_price, 2)}`}
          </AtListItem>
        </View>
        <Form className={classnames('m-t-48', 'fiche', styles.form_box)}>
          <AtListItem title='签约方式'>
            在线合同
          </AtListItem>
          <ATInputFix
            inForm
            title='姓名'
            placeholder='占位提示符'
            clear
            error={dState.isName ? '请输入姓名' : ''}
            value={dState.formData.name}
            onChange={onChangeName}
            icon={clearIcon}
          />
          <ATInputFix
            inForm
            title='身份证号'
            placeholder='占位提示符'
            clear
            error={dState.isIdCard ? '请输入正确的身份证号' : ''}
            value={dState.formData.idcard}
            onChange={onChangeIdCard}
            icon={clearIcon}
          />
          <ATInputFix
            inForm
            title='手机号'
            placeholder='占位提示符'
            clear
            error={dState.isPhone ? '请输入正确的手机号' : ''}
            value={dState.formData.mobile}
            onChange={onChangePhone}
            icon={clearIcon}
          />
          {/* <AtInput
            clear
            name='userName'
            title='姓名'
            type='text'
            placeholder='请输入落户人姓名'
            value={dState.formData.name}
            onChange={onChangeName}
          /> */}
          {/* <AtInput
            key='idcard'
            clear
            error={dState.isIdCard}
            title='身份证号'
            placeholder={!dState.isIdCard ? '请输入落户人的身份证号' : '请输入正确的身份证号'}
            placeholderStyle={!dState.isIdCard ? '' : "color:#ff4949"}
            type='idcard'
            value={dState.formData.idcard}
            onChange={onChangeIdCard}
          /> */}
          {/* <AtInput
            clear
            key='phone'
            error={dState.isPhone}
            title='手机号'
            type='phone'
            placeholder={dState.isPhone ? '请输入正确的手机号' : '请输入落户人手机号'}
            placeholderStyle={dState.isPhone ? "color:#ff4949" : ''}
            value={dState.formData.mobile}
            onChange={onChangePhone}
          /> */}
        </Form>
        <View className={classnames('m-t-48', styles.submit)}>
          <Button
            formType='submit'
            type='primary'
            className={styles.submitButton}
            onClick={onSubmit}
          >去支付</Button>
        </View>
      </View>
    </View >
  )
}

export default ConfirmOrder;
