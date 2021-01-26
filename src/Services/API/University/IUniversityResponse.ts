export interface StudentsData {
  fullNames: Array<string>;
  emails: Array<string>;
  organization: string;
}
export interface UniversityData {
  code: string;
  name?: string;
  address?: string;
  noStudentsWithDisability?: string;
  escalationHandledBy?: string;
  domainAccess?: string;
  domain?: string;
  autoAccess: string;
}
export interface MetricsData {
  averageRatingAfc: number;
  averageResolutionTimeAfc: number;
  totalRequestsAfc: number;
  studentsUsingAfc: number;
  averageRatingVc: number;
  averageResolutionTimeVc: number;
  totalRequestsVc: number;
  studentsUsingVc: number;
}

export interface MetricsResponse {
  flag: string;
  message: string;
  data?: MetricsData;
  code: number;
  error?: string;
}
