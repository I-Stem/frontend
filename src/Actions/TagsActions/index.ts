import { Tags } from "@Services";
import { ITagsPayload } from "@Interfaces";

export const TagsActions = {
  Search: () => () => {
    return Tags.search();
  },
  Add: (payload: ITagsPayload) => () => {
    return Tags.add({ data: payload });
  },
};
