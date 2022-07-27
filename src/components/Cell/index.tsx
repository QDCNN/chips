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
  colon?: boolean
  tooltip?: React.ReactNode
  tooltipIcon?: React.ReactNode
  layout?: 'vertical' | 'horizontal' | 'inline'
  tooltipLayout?: 'icon' | 'text'
  labelStyle?: React.CSSProperties
  labelAlign?: 'left' | 'right'
  labelWrap?: boolean
  labelWidth?: number | string
  wrapperWidth?: number | string
  labelCol?: number
  wrapperCol?: number
  wrapperAlign?: 'left' | 'right'
  wrapperWrap?: boolean
  wrapperStyle?: React.CSSProperties
  fullness?: boolean
  addonBefore?: React.ReactNode
  addonAfter?: React.ReactNode
  size?: 'small' | 'default' | 'large'
  inset?: boolean
  extra?: React.ReactNode
  feedbackText?: React.ReactNode
  feedbackLayout?: 'loose' | 'terse' | 'popover' | 'none' | (string & {})
  feedbackStatus?: 'error' | 'warning' | 'success' | 'pending' | (string & {})
  feedbackIcon?: React.ReactNode
  getPopupContainer?: (node: HTMLElement) => HTMLElement
  asterisk?: boolean
  gridSpan?: number
  bordered?: boolean
  value?: string
  link?: boolean
}

type ComposeFormItem = React.FC<React.PropsWithChildren<IFormItemProps>> & {
  BaseItem?: React.FC<React.PropsWithChildren<IFormItemProps>>
}

const useFormItemLayout = (props: IFormItemProps) => {
  const layout = useFormLayout()
  const layoutType = props.layout ?? layout.layout ?? 'horizontal'
  return {
    ...props,
    layout: layoutType,
    colon: props.colon ?? layout.colon,
    labelAlign:
      layoutType === 'vertical'
        ? props.labelAlign ?? 'left'
        : props.labelAlign ?? layout.labelAlign ?? 'right',
    labelWrap: props.labelWrap ?? layout.labelWrap,
    labelWidth: props.labelWidth ?? layout.labelWidth,
    wrapperWidth: props.wrapperWidth ?? layout.wrapperWidth,
    labelCol: props.labelCol ?? layout.labelCol,
    wrapperCol: props.wrapperCol ?? layout.wrapperCol,
    wrapperAlign: props.wrapperAlign ?? layout.wrapperAlign,
    wrapperWrap: props.wrapperWrap ?? layout.wrapperWrap,
    fullness: props.fullness ?? layout.fullness,
    size: props.size ?? layout.size,
    inset: props.inset ?? layout.inset,
    asterisk: props.asterisk,
    bordered: props.bordered ?? layout.bordered,
    feedbackIcon: props.feedbackIcon,
    feedbackLayout: props.feedbackLayout ?? layout.feedbackLayout ?? 'loose',
    tooltipLayout: props.tooltipLayout ?? layout.tooltipLayout ?? 'icon',
    tooltipIcon: props.tooltipIcon ?? layout.tooltipIcon,
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
  const labelCol = JSON.stringify(layout.labelCol)

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

console.log('Icon: ', Icon);

// const ICON_MAP = {
//   error: <Icon type="cancel" />,
//   success: <Icon type="success" />,
//   warning: <Icon type="warn" />,
// }

export const BaseItem: React.FC<React.PropsWithChildren<IFormItemProps>> = ({
  children,
  ...props
}) => {
  const [active, setActive] = useState(false)
  const formLayout = useFormItemLayout(props)
  const { containerRef, contentRef, overflow } = useOverflow<
    HTMLDivElement,
    HTMLSpanElement
  >()
  const {
    label,
    style,
    layout,
    colon = true,
    addonBefore,
    addonAfter,
    asterisk,
    feedbackStatus,
    extra,
    feedbackText,
    fullness,
    feedbackLayout,
    feedbackIcon,
    getPopupContainer,
    inset,
    bordered = true,
    labelWidth,
    wrapperWidth,
    labelCol,
    wrapperCol,
    labelAlign,
    wrapperAlign = 'left',
    size,
    labelWrap,
    wrapperWrap,
    tooltipLayout,
    tooltip,
    tooltipIcon,
    value,
    link,
  } = formLayout
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
  if (labelCol || wrapperCol) {
    if (!labelStyle.width && !wrapperStyle.width && layout !== 'vertical') {
      enableCol = true
    }
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

  const getOverflowTooltip = () => {
    if (overflow) {
      return (
        <View>
          <View>{label}</View>
          <View>{tooltip}</View>
        </View>
      )
    }
    return tooltip
  }

  const renderLabelText = () => {
    const labelChildren = (
      <View className={`${prefixCls}-label-content`} ref={containerRef}>
        <View ref={contentRef}>
          {asterisk && <Text className={`${prefixCls}-asterisk`}>{'*'}</Text>}
          <Label>{label}</Label>
        </View>
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
    console.log('props: ', props);
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
          {addonBefore && (
            <View className={cls(`${prefixCls}-addon-before`)}>
              {addonBefore}
            </View>
          )}
          <View
            style={wrapperStyle}
            className={cls({
              [`${prefixCls}-control-content-component`]: true,
              [`${prefixCls}-control-content-component-has-feedback-icon`]:
                !!feedbackIcon,
            })}
          >
            <FormLayoutShallowContext.Provider value={undefined}>
              {formatChildren}
            </FormLayoutShallowContext.Provider>
            {feedbackIcon && (
              <View className={cls(`${prefixCls}-feedback-icon`)}>
                {feedbackIcon}
              </View>
            )}
          </View>
          {addonAfter && (
            <View className={cls(`${prefixCls}-addon-after`)}>{addonAfter}</View>
          )}
        </View>
        {!!feedbackText &&
          feedbackLayout !== 'popover' &&
          feedbackLayout !== 'none' && (
            <View
              className={cls({
                [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
                [`${prefixCls}-help`]: true,
                [`${prefixCls}-help-enter`]: true,
                [`${prefixCls}-help-enter-active`]: true,
              })}
            >
              {feedbackText}
            </View>
          )}
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
        asterisk: props.asterisk,
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
      if (props.feedbackText) return props.feedbackText
      if (field.selfErrors.length) return split(field.selfErrors)
      if (field.selfWarnings.length) return split(field.selfWarnings)
      if (field.selfSuccesses.length) return split(field.selfSuccesses)
    }
    const takeAsterisk = () => {
      if (field.required && field.pattern !== 'readPretty') {
        return true
      }
      if ('asterisk' in props) {
        return props.asterisk
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
