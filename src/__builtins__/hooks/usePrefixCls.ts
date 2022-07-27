export const usePrefixCls = (
  tag?: string,
  props?: {
    prefixCls?: string
  }
) => {
  const prefix = props?.prefixCls ?? 'weui-'
  return `${prefix}${tag ?? ''}`
}
