import { SortOrder } from './SortOrder';
import { IPaginationProps } from './IPaginationProps';

export default abstract class StandardService {
  paginateAndSort = (params: IPaginationProps) => {
    const { page, pageSize, sort } = params;
    const order = this.sort(sort);
    if (order.length > 0) {
      return { ...this.paginate(page, pageSize), order: [order] };
    }
    return { ...this.paginate(page, pageSize) };
  };

  paginate = (page, pageSize): {} => {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    return {
      offset,
      limit,
    };
  };

  sort = (sort?: string): string[][] => {
    const order = [];
    if (sort) {
      const sortOrder = sort.startsWith('-') ? SortOrder.DESC : SortOrder.ASC;
      // order.push(['created_at', sortOrder]);
      order.push([sort.replace('-', ''), sortOrder]);
    }
    return order;
  };
}
