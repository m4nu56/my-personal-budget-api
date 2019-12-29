export default abstract class StandardService {
  paginate = ({ page = 1, pageSize = 10 }) => {
    const offset = page * pageSize;
    const limit = pageSize;

    return {
      offset,
      limit,
    };
  };
}
