export interface contactCandidateParams {
  subject: string;
  message: string;
  jobId: string;
}

export interface hiringParameters {
  natureOfJob?: string;
  highestEducation?: string;
  industry?: string[];
  associatedDisabilities?: string[];
}

export interface hiringActionParams {
  jobId: string;
  action: string;
  comment?: string;
}

export interface CandidatesData {
  highestDegree: string;
  highestEducation: string;
  major: string;
  workExperience: string;
  associatedDisabilities: string[];
  currentPlace: string;
  canRelocate: string;
  id: string;
  interested: string[];
  ignored: string[];
  userName: string;
  linkedIn: string;
  portfolioLink: string;
  resumeLink: string;
  userEmail: string;
  actionLog: any[];
}
export interface CandidatesDataResponse {
  code: number;
  data: CandidatesData[];
  error: string;
  flag: string;
  message: string;
}
export interface FilterParams {
  params: {
    status: string;
  };
}
