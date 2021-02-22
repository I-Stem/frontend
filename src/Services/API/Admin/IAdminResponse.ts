export interface AdminResponse {
  code: number;
  data: AdminDataResponse;
  error: boolean;
  flag: string;
  message: string;
}

export interface AdminDataResponse {
  allRequests: AllServiceRequests[] | AllServiceReviews[];
}

export interface AllServiceRequests {
  name: string;
  currentStatus: string;
  requestedOn: string;
  id: string;
}

export interface AllServiceReviews {
  name: string;
  currentStatus: string;
  reviewedOn: string;
  reviewedBy: string;
  id: string;
  action: string;
}

export interface AllAdminRequests {
  serviceRoleRequest?: ServiceRole;
  organizationRequest?: OrganizationRequest;
  statusLog?: StatusLog[];
  status: string;
  requestType: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

interface ServiceRole {
  userId: string;
  role: string;
  fullName: string;
  email: string;
}

interface OrganizationRequest {
  organizationCode: string;
  organizationName?: string;
  userId?: string;
}

interface StatusLog {
  actionAt: string;
  status: string;
}
