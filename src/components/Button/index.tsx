import React from 'react'
import { Button as TaroButton } from '@tarojs/components'
import classNames from 'classnames'
import { useForm } from '@formily/react'

export const Button = (props) => {
  // const form = useForm();
  const { disabled, size, type = 'primary', formType, plain, className, children, onClick, ...others } = props;
  const cls = classNames({
    'weui-btn': true,
    'weui-btn_mini': size === 'small',
    'weui-btn_primary': type === 'primary' && !plain,
    'weui-btn_default': type === 'default' && !plain,
    'weui-btn_warn': type === 'warn',
    'weui-btn_plain-primary': type === 'primary' && plain,
    'weui-btn_plain-default': type === 'default' && plain,
    'weui-btn_disabled': disabled && !plain,
    'weui-btn_plain-disabled': disabled && plain,
    [className]: className
  });
  const handleClick = () => {
    onClick?.();
  };
  return (
    <TaroButton onClick={handleClick} formType="submit" disabled={disabled} className={cls} {...others}>{children}</TaroButton>
  )
}

export default Button;
