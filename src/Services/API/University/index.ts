import { RemediationSetting } from "@Definitions/Constants";
import { CardPreferences, UserPreferences } from "@Interfaces";
import { Http } from "@Services";
import { MetricsData, MetricsResponse } from "./IUniversityResponse";

interface studentsData {
  fullNames: Array<string>;
  emails: Array<string>;
  organization?: string;
  rollNos: Array<string>;
  role: string;
}
interface universityData {
  code?: string;
  name?: string;
  address?: string;
  noStudentsWithDisability?: string;
  escalationHandledBy?: string;
  handleAccessibilityRequests?: string;
  domainAccess?: string;
  domain?: string;
}

interface universityResponseData {
  flag: string;
  message: string;
  data?: universityData;
  code: number;
  error?: string;
}

interface UniversityStudentsParams {
  params: {
    limit: number;
    offset: number;
    searchString: string;
  };
}

interface StudentActivityParams {
  params: {
    studentId: string;
  };
}

interface StudentDetail {
  fullname: string;
  email: string;
  rollNumber: string;
  userId: string;
}

export const UniversityPortal = {
  studentDataVerification: async (payload: Array<any>): Promise<any> => {
    return Http.post("/university/student", undefined, payload);
  },
  studentInvite: async (payload: studentsData): Promise<any> => {
    return Http.post("/university/invite", undefined, payload);
  },
  registerUniversity: async (payload: universityData): Promise<any> => {
    return Http.post("/university/register", undefined, payload);
  },
  getUniversity: async (): Promise<universityResponseData> => {
    return Http.get<universityResponseData>("/university");
  },
  saveSettings: async (payload: universityData): Promise<any> => {
    return Http.post("/university/settings", undefined, payload);
  },
  getUniversityMetrics: async (): Promise<MetricsResponse> => {
    return Http.get<MetricsResponse>("/university/metrics");
  },
  studentsData: async (params: UniversityStudentsParams): Promise<any> => {
    return Http.get("/university/index", params.params);
  },
  studentActivityData: async (params: StudentActivityParams): Promise<any> => {
    return Http.get("/university/index/student", params.params);
  },
  updateStudentDetail: async (payload: StudentDetail): Promise<any> => {
    return Http.post("/university/index/student/update", undefined, payload);
  },
  studentsCount: async (payload: {
    params: { searchString: string };
  }): Promise<any> => {
    return Http.get("/university/studentsCount", payload.params);
  },
  updateUserCardPreferences: async (payload: UserPreferences): Promise<any> => {
    return Http.post("/university/onboardCards", undefined, payload);
  },
  emailStudentsReport: async (): Promise<any> => {
    return Http.get("/university/emailReport");
  },
  handleUniversity: async (
    organizationCode: string,
    action: string,
    payload: {
      id: string;
      handleAccessibilityRequests?: RemediationSetting;
      showRemediationSetting?: boolean;
    }
  ): Promise<any> => {
    return Http.post(
      `/university/organ/req/${organizationCode}/${action}`,
      undefined,
      payload
    );
  },
  handleDomainAccess: async (
    action: string,
    payload: { code: string; id: string }
  ): Promise<any> => {
    return Http.post(`university/domainAcess/${action}`, undefined, payload);
  },
};
