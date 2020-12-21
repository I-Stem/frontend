// #region Local Imports
import { Http } from "@Services";
import axios from 'axios';
import { response } from "express";
// #endregion Local Imports

// #region Interface Imports

import { CreditsModel, FeedbackFlagsModal, GenericFeedbackModel } from "./Credits";
import { FeedbackData } from "./ICreditsResponse";
// #endregion Interface Imports

export const CreditsService = {
  getCredits: async (): Promise<CreditsModel.GetApodResponse> => {
    return Http.get<CreditsModel.GetApodResponse>("/credits/count");
  },

  getCreditsHistory: async (): Promise<CreditsModel.GetApodResponse> => {
    return Http.get<CreditsModel.GetApodResponse>("/credits");
  },

  getFeedbackFlags: async (): Promise<FeedbackFlagsModal.GetApodResponse> => {
    return Http.get<FeedbackFlagsModal.GetApodResponse>("/game/feedback");
  },
  
  giveFeedback(params: FeedbackData) {
    Http.post("/game/feedback",undefined, params)
    .then(response =>{
      console.log(response)
    }).catch((error: any) => {
        console.log("Error occurred while sending request.", error);
      });
  },
};
