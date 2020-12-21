// #region Global Imports
import { Dispatch } from "redux";
// #endregion Global Imports

// #region Local Imports
import { ActionConsts } from "@Definitions";
import { CommunityService } from "@Services";
// #endregion Local Imports

// #region Interface Imports
import {JobPreferencesData, JobPreferencesResponse, MentorshipData} from "@Services/API/Community"
import {IStore} from "@Redux/IStore"
// #endregion Interface Imports

export const CommunityActions = {

    GetDisabilities: () => () => {
        return CommunityService.getDisabilitiesData()
          .then(result => {
            if (!result.error) {
              return result.data;
            }
            return { ...result, error: true };
          })
          .catch(e => {
            return { ...e, error: true };
          });
      },

      GetIndustry: () => () => {
        return CommunityService.getIndustryData();
      },

      GetSkills: () => () => {
        return CommunityService.getSkillsData()
          .then(result => {
            if (!result.error) {
              return result.data;
            }
            return { ...result, error: true };
          })
          .catch(e => {
            return { ...e, error: true };
          });
      },
      GetMentorship: () => () => {
        return CommunityService.getMentorship()
          .then(result => {
            if (!result.error) {
              return result.data;
            }
            return { ...result, error: true };
          })
          .catch(e => {
            return { ...e, error: true };
          });
      },

      PostJobPreferences: (payload: JobPreferencesData) => async (
        dispatch: Dispatch,
        getState: () => IStore
        ) => {
                console.log("Payload", payload)
                return await CommunityService.postJobPreferences({params: payload });
      }, 
}
