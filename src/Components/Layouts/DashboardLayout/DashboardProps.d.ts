import { UserType } from "@Definitions/Constants";

export interface DashboardProps {
  children: JSX.Element[] | JSX.Element;
  hideBreadcrumb: boolean;
  userType?: UserType;
  role?: string;
}
