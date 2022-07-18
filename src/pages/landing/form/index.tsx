import { View, Text, Button, Form, Label, Input, Icon, Image } from '@tarojs/components'
import styles from './index.module.less'
import classnames from 'classnames'
import { useRef, useState } from 'react'
import * as API from '@/api';
import { useDuraArray } from '@/hooks/use-dura';
import Taro from '@tarojs/taro';

// Taro.get

const model = {
  state: () => ({}),
  reducers: () => ({}),
  effects: ({ dispatch, actionCreator, getState }) => ({
    async sendSms(params) {
      const env = Taro.getEnv();
      if (Taro.ENV_TYPE.JD === env) {
        await API.jdSendSms(params);
      }

      if (Taro.ENV_TYPE.ALIPAY === env) {
        await API.tbSendSms(params);
      }
      Taro.showToast({ title: '短信发送成功', icon: 'none', duration: 2000 });
    }
  })
};

const LandingHome = () => {
  const [dState, dDispatch, dActionCreator] = useDuraArray(model);
  const formRef = useRef(null);
  const onSubmit = (e) => {
    const mobile = e.detail.value;
    if (!mobile || mobile.length !== 11) {
      return Taro.showToast({ title: '手机号码错误，请检查', icon: 'none', duration: 2000 });
    }
    dDispatch(dActionCreator.sendSms(mobile));
  };

  return (
    <View className={classnames('page', styles.page)}>
      <View className={classnames('container', styles.container)}>
        <Form ref={formRef} className={styles.form} onSubmit={onSubmit}>
          <View className={styles.formItem}>
            <Label className={styles.label}>手机号</Label>
            <Input className={styles.input} placeholder="请输入手机号" name="mobile" />
          </View>

          <Button className={styles.button} formType="submit">
            <Image className={styles.drawButton} src={require('./assets/draw-button.png')} mode="widthFix" />
          </Button>
        </Form>

        <View className={styles.footer}>
          <View className={styles.footerText}>
            <Text>您会收到一条来自星鲨的短信，短信中有购买链接，您可通过购买链接下单</Text>
          </View>

          <View className={styles.footerText}>
            <Text>如您未收到短信，可反复领取</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default LandingHome;
