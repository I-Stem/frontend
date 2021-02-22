import { IUploadPayload } from "@Services/API/Upload/IUploadPayload";
import { serviceTypeEnum } from "./constants";

export declare module IUpload {
  export interface IProps {
    type?: string;
    size?: number;
    accept?: string;
    isUploading?: boolean;
    files: { [key: string]: IUploadPayload };
    initiateUploading(payload: IUploadPayload);
    uploadFile(payload: IUploadPayload);
    onUpload?: (filename: string) => void;
    required?: boolean;
    label?: string;
    serviceType: serviceTypeEnum;
  }

  export interface IProgressProps {
    isUploading: boolean;
    files: {};
    handleDeleteClick(payload: IUploadPayload);
    onChangeFocus?: Function;
  }

  export interface IState {}

  export interface IStateProps {
    isUploading: boolean;
    files: {};
    [key: string]: {};
  }

  module Actions {
    export interface IMapPayload {
      type: string;
      hash: string;
      progress: number;
    }
    export interface IMapResponse {}
  }
}
