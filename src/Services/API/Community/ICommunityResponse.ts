export interface DisabilitiesData {
  _id: String;
  name: String;
  createdAt: String;
  updatedAt: String;
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
  contactNumber?: string;
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
  _id: String;
  name: String;
  createdAt: String;
  updatedAt: String;
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
