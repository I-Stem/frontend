import { IUploadPayload, IUploadResponse } from "@Interfaces";

declare namespace UploadModel {
  export interface PostApodPayload {
    data: IUploadPayload;
  }
  export interface PostApodResponse extends IUploadResponse {}
}

export { UploadModel };
