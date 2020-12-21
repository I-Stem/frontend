import axios from "axios";

import { UploadModel } from "@Interfaces";
import { Http } from "@Services";
import { IUploadPayload } from "./IUploadPayload";

const { CancelToken } = axios;

export const UploadService = {
  initiateUpload: (
    payload: IUploadPayload,
    progressCallback: Function,
    cancelCallback: Function
  ): Promise<UploadModel.PostApodResponse> => {
    const config = {
      onUploadProgress: progressCallback,
      headers: { "Content-Type": "multipart/form-data" },
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancelCallback(c);
      }),
    };

    const formData = new FormData();
    formData.append("file", payload.file);
    formData.set("hash", payload.hash || "");
    formData.append("fileName", payload.fileName || "");
    return Http.post("/file", undefined, formData, config);
  },
};
