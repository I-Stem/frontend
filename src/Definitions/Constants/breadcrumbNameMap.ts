interface IBreadcrumbItem {
  title: string;
  url: string;
}

export const BREADCRUMB_MAP: { [index: string]: IBreadcrumbItem } = {
  dashboard: {
    title: "I-Stem Programs & Resources",
    url: "/",
  },
  "format-conversion": {
    title: "Training",
    url: "/dashboard/format-conversion",
  },
  "video-captioning": {
    title: "Training",
    url: "/dashboard/video-captioning",
  },
};

export const MENU_ITEMS = [
  {
    name: "Dashboard",
    link: "/",
  },
  {
    name: "Credit Balance",
    link: "/credits",
  },
];
export const UNIVERSITY_STAFF_MENU_ITEMS = [
  {
    name: "Students",
    link: "/organization/students",
  },
  {
    name: "Metrics",
    link: "/organization/metrics",
  },
  {
    name: "Settings",
    link: "/organization/settings",
  },
];
export const BUSINESS_STAFF_MENU_ITEMS = [
  {
    name: "Employees",
    link: "/organization/employees",
  },
  {
    name: "Metrics",
    link: "/organization/metrics",
  },
  {
    name: "Settings",
    link: "/organization/settings",
  },
  {
    name: "Hiring",
    link: "/dashboard/hiring",
  },
];
export const ISTEM_ADMIN_MENU_ITEMS = [
  {
    name: "USERS",
    link: "/organization/students",
  },
  {
    name: "Metrics",
    link: "/organization/metrics",
  },
  {
    name: "Settings",
    link: "/organization/settings",
  },
  {
    name: "Hiring",
    link: "/dashboard/hiring",
  },
  {
    name: "Escalations",
    link: "/organization/escalation",
  },
  {
    name: "Admin Panel",
    link: "/admin",
  },
];

export const ISTEM_REMEDIATOR_MENU_ITEMS = [
  {
    name: "Escalations",
    link: "/organization/escalation",
  },
];
export const VC_BASE_URL = "/dashboard/video-captioning";
export const AFC_BASE_URL = "/dashboard/format-conversion";
