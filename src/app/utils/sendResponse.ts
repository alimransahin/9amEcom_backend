import { Response } from "express";
interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string | null | any;
  data: T;
  token?: string;
  count?: number;
  total?: number;
}
const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode).json(data);
};
export default sendResponse;
