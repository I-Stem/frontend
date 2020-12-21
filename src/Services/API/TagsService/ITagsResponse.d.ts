export interface ITagsData {
  _id?: string;
  userId?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
export interface ITagsResponse {
  flag: string;
  message: string;
  data: [ITagsData];
  code: number;
}
