import React, { useRef, useState } from 'react'
import cls from 'classnames'
import { isVoidField } from '@formily/core'
import { connect, mapProps } from '@formily/react'
import { Icon, View, Text, Label } from '@tarojs/components'
import { useFormLayout, FormLayoutShallowContext } from '../../form-layout'
import { usePrefixCls, pickDataProps } from '../../__builtins__'
// import { Tooltip, Popover } from 'antd'

export interface IFormItemProps {
  className?: string
  style?: React.CSSProperties
  prefixCls?: string
  label?: React.ReactNode
  labelStyle?: React.CSSProperties
  labelAlign?: 'left' | 'right'
  labelWrap?: boolean
  labelWidth?: number | string
  wrapperWidth?: number | string
  wrapperAlign?: 'left' | 'right'
  wrapperWrap?: boolean
  wrapperStyle?: React.CSSProperties
  extra?: React.ReactNode
  bordered?: boolean
  value?: string
  link?: boolean
  dot?: boolean
}

type ComposeFormItem = React.FC<React.PropsWithChildren<IFormItemProps>> & {
  BaseItem?: React.FC<React.PropsWithChildren<IFormItemProps>>
}

const useFormItemLayout = (props: IFormItemProps) => {
  const layout = useFormLayout()
  return {
    ...props,
    labelWrap: props.labelWrap ?? layout.labelWrap,
    labelWidth: props.labelWidth ?? layout.labelWidth,
    wrapperWidth: props.wrapperWidth ?? layout.wrapperWidth,
    wrapperAlign: props.wrapperAlign ?? layout.wrapperAlign,
    wrapperWrap: props.wrapperWrap ?? layout.wrapperWrap,
    bordered: props.bordered ?? layout.bordered,
  }
}

function useOverflow<
  Container extends HTMLElement,
  Content extends HTMLElement
>() {
  const [overflow, setOverflow] = useState(false)
  const containerRef = useRef<Container>()
  const contentRef = useRef<Content>()
  const layout = useFormLayout()

  // useEffect(() => {
  //   requestAnimationFrame(() => {
  //     if (containerRef.current && contentRef.current) {
  //       const contentWidth = contentRef.current.getBoundingClientRect().width
  //       const containerWidth =
  //         containerRef.current.getBoundingClientRect().width
  //       if (contentWidth && containerWidth && containerWidth < contentWidth) {
  //         if (!overflow) setOverflow(true)
  //       } else {
  //         if (overflow) setOverflow(false)
  //       }
  //     }
  //   })
  // }, [labelCol])

  return {
    overflow,
    containerRef,
    contentRef,
  }
}

// const ICON_MAP = {
//   error: <Icon type="cancel" />,
//   success: <Icon type="success" />,
//   warning: <Icon type="warn" />,
// }

export const BaseItem: React.FC<React.PropsWithChildren<IFormItemProps>> = ({
  children,
  ...props
}) => {
  // const [active, setActive] = useState(false)
  const formLayout = useFormItemLayout(props)
  const { containerRef, contentRef, overflow } = useOverflow<
    HTMLDivElement,
    HTMLSpanElement
  >()
  const {
    label,
    style,
    extra,
    labelWidth,
    wrapperWidth,
    value,
    link,
    dot,
  } = props
  const labelStyle = { ...formLayout.labelStyle }
  const wrapperStyle = { ...formLayout.wrapperStyle }
  // 固定宽度
  let enableCol = false
  if (labelWidth || wrapperWidth) {
    if (labelWidth) {
      labelStyle.width = labelWidth === 'auto' ? undefined : labelWidth
      labelStyle.maxWidth = labelWidth === 'auto' ? undefined : labelWidth
    }
    if (wrapperWidth) {
      wrapperStyle.width = wrapperWidth === 'auto' ? undefined : wrapperWidth
      wrapperStyle.maxWidth = wrapperWidth === 'auto' ? undefined : wrapperWidth
    }
    // 栅格模式
  }

  const prefixCls = usePrefixCls('cell', props)
  const formatChildren = children;
  // feedbackLayout === 'popover' ? (
  //   <Popover
  //     autoAdjustOverflow
  //     placement="top"
  //     content={
  //       <div
  //         className={cls({
  //           [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
  //           [`${prefixCls}-help`]: true,
  //         })}
  //       >
  //         {ICON_MAP[feedbackStatus]} {feedbackText}
  //       </div>
  //     }
  //     visible={!!feedbackText}
  //     getPopupContainer={getPopupContainer}
  //   >
  //     {children}
  //   </Popover>
  // ) : (
  //   children
  // )

  const gridStyles: React.CSSProperties = {}

  const renderLabelText = () => {
    const labelChildren = (
      <View className={`${prefixCls}__label-content`} ref={containerRef}>
        <View ref={contentRef}>
          <Label>{label}</Label>
        </View>
        {dot && (
          <View className={`${prefixCls}__dot-box`}>
            <View className={`${prefixCls}__dot`}></View>
          </View>
        )}
      </View>
    )

    return labelChildren
  }

  // const renderTooltipIcon = () => {
  //   if (tooltip && tooltipLayout === 'icon' && !overflow) {
  //     return (
  //       <span className={`${prefixCls}-label-tooltip-icon`}>
  //         <Tooltip placement="top" align={{ offset: [0, 2] }} title={tooltip}>
  //           {tooltipIcon}
  //         </Tooltip>
  //       </span>
  //     )
  //   }
  // }

  const renderLabel = () => {
    if (!label) return null
    return (
      <View
        className={cls({
          [`${prefixCls}__hd`]: true,
          // [`${prefixCls}-label-tooltip`]:
          //   (tooltip && tooltipLayout === 'text') || overflow,
          // [`${prefixCls}-item-col-${labelCol}`]: enableCol && !!labelCol,
        })}
        style={labelStyle}
      >
        {renderLabelText()}
        {/* {renderTooltipIcon()} */}
        {/* {label !== ' ' && (
          <Text className={`${prefixCls}-colon`}>{colon ? ':' : ''}</Text>
        )} */}
      </View>
    )
  }

  const onClick = () => {
    console.log('props: ', props, children, value);
  }

  return (
    <View
      {...pickDataProps(props)}
      style={{
        ...style,
        ...gridStyles,
      }}
      onClick={onClick}
      data-grid-span={props.gridSpan}
      className={cls({
        [`${prefixCls}`]: true,
        [`${prefixCls}_access`]: link,
        // [`${prefixCls}-${feedbackStatus}`]: !!feedbackStatus,
        // [`${prefixCls}-feedback-has-text`]: !!feedbackText,
        // [`${prefixCls}-size-${size}`]: !!size,
        // [`${prefixCls}-feedback-layout-${feedbackLayout}`]: !!feedbackLayout,
        // [`${prefixCls}-fullness`]: !!fullness || !!inset || !!feedbackIcon,
        // [`${prefixCls}-inset`]: !!inset,
        // [`${prefixCls}-active`]: active,
        // [`${prefixCls}-inset-active`]: !!inset && active,
        // [`${prefixCls}-label-align-${labelAlign}`]: true,
        // [`${prefixCls}-control-align-${wrapperAlign}`]: true,
        // [`${prefixCls}-label-wrap`]: !!labelWrap,
        // [`${prefixCls}-control-wrap`]: !!wrapperWrap,
        // [`${prefixCls}-bordered-none`]:
        //   bordered === false || !!inset || !!feedbackIcon,
        [props.className]: !!props.className,
      })}
    // onFocus={() => {
    //   if (feedbackIcon || inset) {
    //     setActive(true)
    //   }
    // }}
    // onBlur={() => {
    //   if (feedbackIcon || inset) {
    //     setActive(false)
    //   }
    // }}
    >
      {renderLabel()}
      <View className={cls({
        [`${prefixCls}__bd`]: true,
      })}
      >
        {value && value}
      </View>
      <View
        className={cls({
          [`${prefixCls}__ft`]: true,
          // [`${prefixCls}-item-col-${wrapperCol}`]:
          //   enableCol && !!wrapperCol && label,
        })}
      >
        <View className={cls(`${prefixCls}-control-content`)}>
          <View
            style={wrapperStyle}
            className={cls({
              [`${prefixCls}-control-content-component`]: true,
            })}
          >
            <FormLayoutShallowContext.Provider value={undefined}>
              {formatChildren}
            </FormLayoutShallowContext.Provider>
          </View>
        </View>
        {extra && <View className={cls(`${prefixCls}-extra`)}>{extra}</View>}
      </View>
    </View>
  )
}

// 适配
export const Cell: ComposeFormItem = connect(
  BaseItem,
  mapProps((props, field) => {
    if (isVoidField(field))
      return {
        label: field.title || props.label,
        extra: props.extra || field.description,
      }
    if (!field) return props
    const takeFeedbackStatus = () => {
      if (field.validating) return 'pending'
      return field.decoratorProps.feedbackStatus || field.validateStatus
    }
    const takeMessage = () => {
      const split = (messages: any[]) => {
        return messages.reduce((buf, text, index) => {
          if (!text) return buf
          return index < messages.length - 1
            ? buf.concat([text, ', '])
            : buf.concat([text])
        }, [])
      }
      if (field.validating) return
      if (field.selfErrors.length) return split(field.selfErrors)
      if (field.selfWarnings.length) return split(field.selfWarnings)
      if (field.selfSuccesses.length) return split(field.selfSuccesses)
    }
    const takeAsterisk = () => {
      if (field.required && field.pattern !== 'readPretty') {
        return true
      }
      return false
    }
    return {
      label: props.label || field.title,
      feedbackStatus: takeFeedbackStatus(),
      feedbackText: takeMessage(),
      asterisk: takeAsterisk(),
      extra: props.extra || field.description,
    }
  })
)

Cell.BaseItem = BaseItem

export default Cell
