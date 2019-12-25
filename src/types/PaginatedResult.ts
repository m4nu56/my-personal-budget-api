export default class PaginatedResult {
  data: any[];
  total: number;

  constructor(data: any[]) {
    this.data = data;
    this.total = data.length;
  }
}
