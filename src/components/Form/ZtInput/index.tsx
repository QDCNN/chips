import { Button, Input, Label, Picker, Switch, Text, Textarea, View } from '@tarojs/components';
import styles from '../form.module.less';
import classnames from 'classnames';
import { AtTextarea } from 'taro-ui';

const ZtInput = ({ title, value, type, verify, placeholder, className, onClick, onChange, onClearHandle }) => {

  const onTimeChange = (e) => {
    console.log('onTimeChange', e);

  }

  const onDateChange = (e) => {
    console.log('onDateChange', e);

  }


  return (




    <View className={classnames(className, styles.form_item)}>
      {/*
          type 类型 辨别使用哪种组件
            input 输入框 
            textarea 多行输入
            picker 底部多项选择器
            switch 开关
      */}
      {
        type === 'title' && (
          <View className={styles.form_item_title}>
            <View className={styles.form_title}>
              <Text>{value}</Text>
            </View>
          </View>
        )
      }
      {
        type === 'subtitle' && (
          <View className={styles.form_item_subtitle}>
            <View className={styles.form_subtitle}>
              <Text>{value}</Text>
            </View>
          </View>
        )
      }
      {
        type === 'describe' && (
          <View className={styles.form_item_describe}>
            <View className={styles.form_describe}>
              <Text>{value}</Text>
            </View>
          </View>
        )
      }
      {
        type === 'input' && (
          <View className={styles.form_item_input}>
            <Input className={styles.form_input} placeholder='请输入姓名' ></Input>
          </View>
        )
      }
      {
        type === 'textarea' && (
          <View className={styles.form_item_textarea}>
            <Textarea placeholder='placeholder' className={styles.form_textarea} maxlength='300' autoFocus ></Textarea>
          </View>
        )
      }
      {
        type === 'switch' && (
          <View className={styles.form_item_switch}>
            <Switch className={styles.form_switch} />
          </View>
        )
      }
      {
        type === 'time' && (
          <View className={styles.form_item_switch}>
            <Picker mode={type} onChange={onTimeChange}>
              <View className='picker'>
                时间
                {/* 当前选择：{this.state.timeSel} */}
              </View>
            </Picker>
          </View>
        )
      }
      {
        type === 'date' && (
          <View className={styles.form_item_switch}>
            <Picker mode={type} onChange={onDateChange}>
              <View className='picker'>
                日期
                {/* 当前选择：{this.state.timeSel} */}
              </View>
            </Picker>
          </View>
        )
      }

      {/* <View className={styles.form_item_button}>
        <Button type='primary' className={styles.form_button}>确认</Button>
      </View> */}
    </View>
  );
}

export default ZtInput;

