// #region Interface Imports
import {
  FeedbackData,
  IAfcService,
  ICommunityService,
  ICreditsData,
  IHomePage,
  IMessage,
  IUpload,
  IVCService,
  IAuth,
  IUniversity,
} from "@Interfaces";
// #endregion Interface Imports

export interface IStore {
  vcService: IVCService.IStateProps;
  afcService: IAfcService.IStateProps;
  upload: IUpload.IStateProps;
  home: IHomePage.IStateProps;
  auth: IAuth.IAuthStateProps;
  message: IMessage.IMessageStateProps;
  credits: ICreditsData;
  feedback: FeedbackData;
  communityService: ICommunityService.IStateProps;
  university: IUniversity.IStateProps;
}
