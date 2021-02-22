export interface AdminRequestsProps {
  fullName?: string;
  email?: string;
  requestedRole?: string;
  currentRole?: string;
  organizationName?: string;
  requestedDomainName?: string;
  orgCode?: string;
}

export const serviceRequestFields = [
  { field: "Full Name", attribute: "fullName" },
  { field: "Email", attribute: "email" },
  { field: "Requested Service Role", attribute: "requestedRole" },
];

export const autoDomainRequestFields = [
  { field: "Organization Name", attribute: "organizationName" },
  { field: "Requested Domain Name", attribute: "requestedDomain" },
  { field: "Requested By", attribute: "fullName" },
];

export const organizationRequestFields = [
  { field: "Organization Name", attribute: "organizationName" },
  { field: "Requested User Name", attribute: "fullName" },
  { field: "Requested User Email", attribute: "email" },
];

export enum requestTypeConstants {
  ORGANIZATION = "ORGANIZATION",
  SERVICE = "SERVICE",
  AUTO_DOMAIN = "AUTO_DOMAIN",
}

export const adminPageLink = [
  {
    link: "/admin/domain",
    message: "Auto Domain access",
    name: requestTypeConstants.AUTO_DOMAIN,
  },
  {
    link: "/admin/organization",
    message: "Organization Creation",
    name: requestTypeConstants.ORGANIZATION,
  },
  {
    link: "/admin/service",
    message: "AI Service role upgradation",
    name: requestTypeConstants.SERVICE,
  },
];
