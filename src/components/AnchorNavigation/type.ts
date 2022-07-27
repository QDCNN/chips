// import { CommonData, RGBA } from '../type';

export enum AnchorNavigationShowType {
  /**
   * 标准展示样式
   * 文字+可选图标+可选下划线
   */
  Normal = 'Normal',
  /**
   * 圆角边框（圆形块）
   */
  RadiusBorder = 'RadiusBorder',
}

export interface AnchorNavigationData {
  /** 是否可以滚动 */
  scroll: boolean;
  // /**  */
  // padding: number,
  /** 是否下标线 */
  hasLine: boolean;
  /** 下内边距 */
  paddingBottom: number;
}
