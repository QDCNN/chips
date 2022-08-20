import { Cell as VantCell } from '@antmjs/vantui';

export const Cell = (props) => {
  const style: any = props.style || {};
  if (props.disabled) {
    style.color = '#c8c9cc';
  };

  return (
    <VantCell style={style} {...props} />
  )
}

export default Cell;
