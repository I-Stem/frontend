import { DASHBOARD_ROUTE } from "../pageroutes";

export enum UserCreationContext {
  HACKATHON = "HACKATHON",
}

const contextPathsMap = new Map([
  [UserCreationContext.HACKATHON.toString(), "/dashboard/hackathon"],
]);

export function getContextPathFromUserCreationContext(
  context: string | undefined
): string {
  if (!context) return DASHBOARD_ROUTE;

  return contextPathsMap.get(context) || DASHBOARD_ROUTE;
}
