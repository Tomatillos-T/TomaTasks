export default interface JPAPaginatedResponse<T> {
  items: T;
  numberOfElements: number;
  totalElements: number;
}
