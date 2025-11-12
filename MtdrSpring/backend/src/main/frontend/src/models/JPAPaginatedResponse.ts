export default interface JPAPaginatedResponse<T> {
  content: T;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
