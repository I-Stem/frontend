export interface DisabilitiesData {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface DisabilitiesDataResponse {
  flag: string;
  message: string;
  data?: DisabilitiesData[];
  code: number;
  error?: string;
}

export interface JobPreferencesData {
  seekingJob: string;
  natureOfJob: String;
  industry: String;
  idealPosition: String;
  highestEducation: String;
  highestDegree: String;
  major: String;
  workExperience: String;
  totalExperience: String;
  associatedDisabilities: string[];
  currentPlace: String;
  canRelocate: String;
  linkedIn: String;
  portfolioLink: String;
  resumeLink: String;
  needCareerHelp: string;
  inputFileId: String;
}

export interface MentorshipData {
  industry: string;
  currentPosition: string;
  isPWD: string;
  associatedDisabilities: string[];
  signupAs: string | undefined;
  learnSkills: string;
  questionToMentor: string;
  menteeAgreement: boolean;
  mentorSkills: string;
  connectOften: string | undefined;
  questionToMentee?: string;
  anythingElse: string;
  pauseMentorship?: boolean;
  cancelMenteeship?: boolean;
  mentorshipStatus?: MentorshipStatus[];
  _id?: string;
}

export interface MentorshipStatus {
  status: string;
  actionAt: Date;
}

export interface MentorshipResponse {
  flag: string;
  message: string;
  data?: MentorshipData[];
  code: number;
  error?: string;
}

export interface JobPreferencesResponse {
  flag: string;
  message: string;
  data?: JobPreferencesData;
  code: number;
  error?: string;
}

export interface IndustryData {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
export interface IndustryResponse {
  flag: string;
  message: string;
  data?: IndustryData[];
  code: number;
  error?: string;
}
export interface SkillsData {
  _id: String;
  name: String;
  createdAt: String;
  updatedAt: String;
}
export interface SkillsResponse {
  flag: string;
  message: string;
  data?: SkillsData[];
  code: number;
  error?: string;
}
export interface HackathonData {
  isPWD: string;
  associatedDisabilities: string[];
  designation: string;
  orgName: string;
  canCode: string;
  preferedAreas: string;
  expectations: string;
  anythingElse: string;
}
export interface HackathonResponse {
  flag: string;
  message: string;
  data?: HackathonData;
  code: number;
  error?: string;
}
