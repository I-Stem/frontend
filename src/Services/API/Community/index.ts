// #region Local Imports
import { Http } from "@Services";
import axios from 'axios';
import { response } from "express";
// #endregion Local Imports

// #region Interface Imports
import { DisabilitiesModal, JobPreferencesModal, IndustryModal, SkillsModal, MentorshipModal } from './Community'
import { DisabilitiesData, JobPreferencesData, MentorshipData } from './ICommunityResponse'

export * from "./ICommunityResponse";
export const CommunityService = {
    getDisabilitiesData: async (): Promise<DisabilitiesModal.GetApodResponse> => {
        return  Http.get<DisabilitiesModal.GetApodResponse>("/disabilities");
    },
    getIndustryData: async (): Promise<IndustryModal.GetApodResponse> => {
        return  Http.get<IndustryModal.GetApodResponse>("/industry");
    },
    getSkillsData: async (): Promise<SkillsModal.GetApodResponse> => {
        return  Http.get<SkillsModal.GetApodResponse>("/skills");
    },
    getMentorship: async (): Promise<MentorshipModal.GetApodResponse> => {
        return  Http.get<MentorshipModal.GetApodResponse>("/mentorship");
    },   

    postJobPreferences: async (
        payload: JobPreferencesModal.PostJobPreferences
        ):  Promise<JobPreferencesModal.GetJobPreferencesResponse> => {
            return Http.post("/job", undefined, payload.params);
        }, 

    postJobPreference(params: JobPreferencesData) {
        Http.post("/job",undefined, params)
        .then(response =>{
            console.log(response)
        }).catch((error: any) => {
                console.log("Error occurred while sending request.", error);
            });
    },

    postMentorship: async (params: MentorshipData) => {
        return Http.post("/mentorship",undefined, params)
    },

};

