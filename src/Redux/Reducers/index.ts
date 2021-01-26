// #region Global Imports
import { combineReducers } from "redux";
// #endregion Global Imports

// #region Local Imports
import { HomeReducer } from "./home";
import { AuthReducer } from "./auth";
import { MessageReducer } from "./message";
import { UploadReducer } from "./upload";
import { AfcReducer } from "./afc";
import { CreditsReducer } from "./credits";
import { VCReducer } from "./vc";
import { CommunityReducer } from "./community";
import { UniversityReducer } from "./university";
import { EscalationReducer } from "./escalation";
// #endregion Local Imports

export default combineReducers({
  upload: UploadReducer,
  home: HomeReducer,
  auth: AuthReducer,
  message: MessageReducer,
  afcService: AfcReducer,
  credits: CreditsReducer,
  vcService: VCReducer,
  communityService: CommunityReducer,
  university: UniversityReducer,
  escalation: EscalationReducer,
});
