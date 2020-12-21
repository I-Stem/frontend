import { DisabilitiesDataResponse, JobPreferencesResponse, JobPreferencesData, IndustryResponse, SkillsResponse, MentorshipResponse } from '@Interfaces';

declare namespace DisabilitiesModal{
    export interface GetApodResponse extends DisabilitiesDataResponse {}
  }

  declare namespace IndustryModal{
    export interface GetApodResponse extends IndustryResponse {}
  }

  declare namespace SkillsModal{
    export interface GetApodResponse extends SkillsResponse {}
  }

  declare namespace MentorshipModal{
    export interface GetApodResponse extends MentorshipResponse {}
  }

declare namespace JobPreferencesModal {
  export interface PostJobPreferences {
    params: JobPreferencesData
  }
  export interface GetJobPreferencesResponse extends JobPreferencesResponse {}
}

export {DisabilitiesModal, JobPreferencesModal, IndustryModal, SkillsModal, MentorshipModal};