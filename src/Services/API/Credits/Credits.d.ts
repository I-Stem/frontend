// #region Interface Imports
import FeedbackModal from "@Components/StemServices/FeedbackModal";
import {
  ICreditsResponse,
  FeedbackData,
  FeedbackResponse,
  FeedbackFlagsResponse,
} from "@Interfaces";
// #endregion Interface Imports

declare namespace CreditsModel {
  export interface GetApodResponse extends ICreditsResponse {}
}

declare namespace GenericFeedbackModel {
  export interface PostApodPayload {
    params: FeedbackData;
  }
  export interface GetApodResponse extends FeedbackResponse {}
}

declare namespace FeedbackFlagsModal {
  export interface GetApodResponse extends FeedbackFlagsResponse {}
}
export { CreditsModel, GenericFeedbackModel, FeedbackFlagsModal };
