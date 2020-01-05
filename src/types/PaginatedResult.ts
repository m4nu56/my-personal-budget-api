export default class PaginatedResult {
  data: any[];
  total: number;

  constructor(data: any[], total: number) {
    this.data = data;
    this.total = total;
  }
}
