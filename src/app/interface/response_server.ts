export interface ResponseServer<T> {
  status: boolean;
  message: string;
  data?: T;
}
