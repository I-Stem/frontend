export interface IUploadPayload {
  [key: string]: string | number;
  file: File;
  type: string;
  progress: number;
  hash?: string;
  fileName?: string;
  initiatedAt?: string;
}
