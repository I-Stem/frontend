export interface IAdmin {
  requestCount: AdminRequestCount;
  reviewCount: AdminRequestCount;
}

export interface AdminRequestCount {
  totalAutoDomainRequests: number;
  totalOrganizationRequests: number;
  totalServiceRequests: number;
}
export module Actions {
  export interface IMapPayLoad {
    requestCount: AdminRequestCount;
    reviewCount: AdminRequestCount;
  }
}
