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
import { AtForm, AtInput, } from 'taro-ui'
import './index.sass'
import { useDuraArray } from '@/hooks/use-dura'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import * as API from '@/api/index'
import { Routes } from '@/routes'



const model = {
  state: () => ({
    formData: {
      name: '',
      idcard: '',
      mobile: '',
    },
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

  const [dState, dDispatch, dActionCreator] = useDuraArray(model);
  // const { global: { goodsList, goodsDetail } } = useSelector((store: RootState) => store);



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




  const onSubmit = () => {
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

    API.buyNow({ ...formDate }).then(res => {
      console.log('支付数据', res);
      if (res.code === 1) {
        // Taro.navigateTo({
        //   url: Routes.PayResultAwait
        // })
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
        {/* <View className='fiche'>
          <ListItem
            iconLeft={addressIcon}
            title={dState.formData.address ? dState.formData.address : '请选择收货地址'}
            iconRight={dState.formData.address ? '' : rightIcon}
            onClick={getAddress}
          ></ListItem>
        </View> */}
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
        <AtForm className={classnames('m-t-48', 'fiche', styles.form_box)}
        // onSubmit={(e) => { submit(e) }}
        >
          <ListItem
            border
            title='签约方式'
            extraText='在线合同'
          ></ListItem>
          <AtInput
            clear
            name='userName'
            focus={dState.formData.name}
            autoFocus
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
        </AtForm>
        <View className={classnames('m-t-48', styles.submit)}>
          <Button
            formType='submit'
            type='primary'
            className={styles.submit_button}
            onClick={onSubmit}
          >提交</Button>
        </View>
      </View>
    </View >
  )
}

export default ConfirmOrder;
