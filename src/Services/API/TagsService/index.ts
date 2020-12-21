import { TagsModel } from "@Interfaces";
import { Http } from "@Services";

export const Tags = {
  search: async (): Promise<TagsModel.PostApodResponse> => {
    return Http.get("/tag");
  },
  add: async (
    payload: TagsModel.PostApodPayload
  ): Promise<TagsModel.PostApodResponse> => {
    return Http.post("/tag", undefined, payload.data);
  },
};
