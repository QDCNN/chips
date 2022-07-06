import { Image, Input, Label, Text, View } from '@tarojs/components';
import styles from './index.module.less';
import classnames from 'classnames';
import { useState } from 'react';
import errorIcon from '@/assets/icon/error.svg'
import clearIcon from '@/assets/icon/clear.svg'

const FormItem = ({ label, value, type, verify, clear, placeholder, className, onClick, onChange, onClearHandle }) => {

  const [errorState, setErrorState] = useState(false);
  const [values, setvalues] = useState(value)

  return (
    <View className={classnames(className, styles.form_item, verify ? styles.error : '')}>
      <View className={styles.form_content}>
        <Label className={styles.form_label}><Text>{label}</Text></Label>
        <Input className={styles.form_input} placeholder={placeholder} type={type} onInput={(res) => { onChange(res) }} value={values} placeholderStyle={verify ? "color:#fa5151;" : ''}></Input>
      </View>
      {verify &&
        <View className={styles.error_icon}>
          <Image src={errorIcon} className={styles.icon}></Image>
        </View>
      }
      {
        clear &&
        <View className={styles.error_icon} onClick={onClearHandle}>
          <Image src={clearIcon} className={styles.icon}></Image>
        </View>
      }
    </View>
  );
}

export default FormItem;

