import { DrawerState } from './create-drawer';

/**
 *
 * @param value useDrawer 返回的数据
 * @param helper useDrawer 返回的工具
 */
export function usePagination<D extends DrawerState['drawer'], T extends DrawerState['toolkit']>(value: D, helper: T, options?: any) {
  return ({
    onChange: (current, size) => {
      if (size && size !== value.pagination.pageSize) {
        helper.changePageSize(size);
      } else {
        helper.jumpPage(current);
      }
    },
    total: value.total,
    pageSize: value.pagination.pageSize,
    currentPage: value.pagination.page,
    ...options,
  })
}
