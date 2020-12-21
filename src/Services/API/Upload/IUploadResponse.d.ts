export interface IUploadData {
  _id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IUploadResponse {
  flag: string;
  message: string;
  data: IUploadData;
  code: number;
}
