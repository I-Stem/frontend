// #region Global Imports
import { combineReducers } from "redux";
import { AuthReducer } from "./auth";
import { MessageReducer } from "./message";
import { UploadReducer } from "./upload";
import { AfcReducer } from "./afc";
import { CreditsReducer } from "./credits";
import { VCReducer } from "./vc";
import { CommunityReducer } from "./community";
import { UniversityReducer } from "./university";
import { EscalationReducer } from "./escalation";
import { AdminReducer } from "./admin";
// #endregion Local Imports

export default combineReducers({
  upload: UploadReducer,
  auth: AuthReducer,
  message: MessageReducer,
  afcService: AfcReducer,
  credits: CreditsReducer,
  vcService: VCReducer,
  communityService: CommunityReducer,
  university: UniversityReducer,
  escalation: EscalationReducer,
  admin: AdminReducer,
});
