interface IBreadcrumbItem {
  title: string;
  url: string;
}

export const BREADCRUMB_MAP: { [index: string]: IBreadcrumbItem } = {
  dashboard: {
    title: "I-Stem Programs & Resources",
    url: "/dashboard",
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
    link: "/dashboard",
  },
  {
    name: "Credit Balance",
    link: "/credits",
  },
];
export const UNIVERSITY_MENU_ITEMS = [
  {
    name: "Metrics",
    link: "/organization/metrics",
  },
  {
    name: "Students",
    link: "/organization/students",
  },
  {
    name: "Settings",
    link: "/organization/settings",
  },
];
export const VC_BASE_URL = "/dashboard/video-captioning";
export const AFC_BASE_URL = "/dashboard/format-conversion";
