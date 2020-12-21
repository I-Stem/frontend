import { ITagsPayload, ITagsResponse } from "@Interfaces";

declare namespace TagsModel {
  export interface PostApodPayload {
    data: ITagsPayload;
  }
  export interface PostApodResponse extends ITagsResponse {}
}
